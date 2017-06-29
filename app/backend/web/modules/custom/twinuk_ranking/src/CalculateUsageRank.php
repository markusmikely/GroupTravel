<?php

namespace Drupal\twinuk_ranking;

use Drupal\Component\Utility\SafeMarkup;
// use Drupal\Component\Utility\String;
use Drupal\Core\TypedData\DataDefinitionInterface;
use Drupal\Core\TypedData\TypedDataInterface;
use Drupal\Core\TypedData\TypedData;

/**
 * A computed property for an average dice roll.
 */
class CalculateUsageRank extends TypedData {

  /**
    * Cached processed text.
    *
    * @var string|null
    */
   protected $processed = 0;

   /**
    * Implements \Drupal\Core\TypedData\TypedDataInterface::getValue().
    */
   public function getValue($langcode = NULL) {

     // usage rank = (views * 0.01) + (saves * 0.1) +  quotes
    //  if ($this->processed !== NULL) {
    //    return $this->processed;
    //  }
     $item = $this->getParent();

    $usage_rank = ($item->views * 0.01) + ($item->saves* 0.1) + $item->quotes;

    $startDate = date('d-m-Y', strtotime($item->updated));
    $futureDate=date('d-m-Y', strtotime('+1 year', strtotime($startDate)));
    $today = date('d-m-Y');

    if(strtotime($futureDate) < strtotime($today)) {
      $x = date('Y', strtotime($today))- date('Y', strtotime($futureDate));
      $$usage_rank = $usage_rank * exp(-2*$x*$x);
    }

     $popularity_rank = $item->popularity;
     $upsell_rank = $item->upsell;

     $this->processed =  $usage_rank + $popularity_rank + $upsell_rank;

     $item->rank = $this->processed;
     return $this->processed;
   }
}
