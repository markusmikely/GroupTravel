<?php

namespace Drupal\twinuk_ranking\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class RankController.
 *
 * @package Drupal\twinuk_ranking\Controller
 */
class RankController extends ControllerBase {

  /**
   * Hello.
   *
   * @return string
   *   Return Hello string.
   */
  public function attractions($experiences, $previous_experiences) {

    $query = \Drupal::entityQuery('node');
    $query->condition('status', 1);
    $query->condition('type', 'attraction');

    // $query->condition('langcode', $language()->getId());

    $ids = $query->execute();

    // $nodes = array('' => , );//\Drupal::entityTypeManager()->getStorage('node')->loadMultiple($ids);
    $attractions = \Drupal::entityTypeManager()->getStorage('node')->loadMultiple($ids);// entity_load_multiple('node', $ids);

    $data = array();
    foreach ($attractions as $attraction) {

      $att_array = array(
        'title' => $attraction->get('title')->value,
        'field_address' => $attraction->get('field_address')->value,
        'body' => $attraction->get('body')->value,
        'field_experiences' => $attraction->get('field_experiences')->getValue(),
        'field_feature' => $attraction->get('field_feature')->value,
        'field_usage' => $attraction->get('field_usage')->value,
      );
      array_push($data, implode($att_array));
    }

    return [
      '#type' => 'markup',
      '#markup' => implode($data),
    ];
  }





  // This controller manages the real time ranking of an attraction node based by using the data strored in the Ranking Field
  // It accepts parameters for 2 sets of tags each set of tags will be run against all atractions in the database and a virtual score will be assigned to the
  // The data will be reordered and limited to 5 results
  // A JSON object is created and returned

}
