<?php

namespace Drupal\twinuk_ranking\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'usage_widget' widget.
 *
 * @FieldWidget(
 *   id = "usage_widget",
 *   label = @Translation("Usage widget"),
 *   field_types = {
 *     "usage_item"
 *   }
 * )
 */
class UsageWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'size' => 60,
      'placeholder' => '',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $elements = [];

    $elements['size'] = [
      '#type' => 'number',
      '#title' => t('Size of textfield'),
      '#default_value' => $this->getSetting('size'),
      '#required' => TRUE,
      '#min' => 1,
    ];
    $elements['placeholder'] = [
      '#type' => 'textfield',
      '#title' => t('Placeholder'),
      '#default_value' => $this->getSetting('placeholder'),
      '#description' => t('Text that will be shown inside the field until a value is entered. This hint is usually a sample value or a brief description of the expected format.'),
    ];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];

    $summary[] = t('Textfield size: @size', ['@size' => $this->getSetting('size')]);
    if (!empty($this->getSetting('placeholder'))) {
      $summary[] = t('Placeholder: @placeholder', ['@placeholder' => $this->getSetting('placeholder')]);
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $popularity = isset($items[$delta]->popularity) ? $items[$delta]->popularity : NULL;
    $upsell = isset($items[$delta]->upsell) ? $items[$delta]->upsell : NULL;

    $numbers = range(1, 5);
    $element += [
      '#type' => 'details',
      '#collapsible' => TRUE,
      '#open' => TRUE,
    ];
    $element['popularity'] =  [
      '#type' => 'select',
      '#title' => t('Popularity'),
      '#options' => $numbers,
      '#empty_value' => '',
      '#default_value' => (isset($items[$delta]->popularity)  ) ? intval($items[$delta]->popularity) : NULL,
      '#description' => t('Select an popularity rank'),
    ];
    $element['upsell'] =  [
      '#title' => t('Upsell'),
      '#type' => 'select',
      '#options' => $numbers,
      '#empty_value' => '',
      '#default_value' => (isset($items[$delta]->upsell)) ? intval($items[$delta]->upsell) : NULL,
      '#description' => t('Select an upsell rank'),
    ];
    $element['views'] =  [
      '#title' => t('Views'),
      '#type' => 'textfield',
      '#empty_value' => '0',
      '#default_value' => (isset($items[$delta]->views)) ? intval($items[$delta]->views) : 0,
      '#disabled' => TRUE,
    ];
    $element['saves'] =  [
      '#title' => t('Saves'),
      '#type' => 'textfield',
      '#empty_value' => '0',
      '#default_value' => (isset($items[$delta]->saves)) ? intval($items[$delta]->saves) : 0,
      // '#disabled' => TRUE,
    ];
    $element['quotes'] =  [
      '#title' => t('Quotes'),
      '#type' => 'textfield',
      '#empty_value' => '0',
      '#default_value' => (isset($items[$delta]->quotes)) ? intval($items[$delta]->quotes) : 0,
      '#disabled' => TRUE,
    ];
    $element['updated'] =  [
      '#title' => t('Updated'),
      '#type' => 'textfield',
      '#empty_value' => '0',
      '#default_value' => (isset($items[$delta]->updated)) ? intval($items[$delta]->updated) : 0,
      '#disabled' => TRUE,
    ];
    $element['value'] =  [
      '#title' => t('Rank'),
      '#type' => 'textfield',
      '#empty_value' => '',
      '#default_value' => (isset($items[$delta]->rank)) ? ($items[$delta]->rank) : NULL,
      '#description' => t('Select an upsell rank'),
      '#disabled' => TRUE,
    ];
    // $element['value'] = [
    //   '#type' => 'textfield',
    //   '#default_value' => isset($items[$delta]->value) ? $items[$delta]->value : NULL,
    //   '#size' => $this->getSetting('size'),
    //   '#placeholder' => $this->getSetting('placeholder'),
    //   '#maxlength' => $this->getFieldSetting('max_length'),
    // ];

    return $element;
  }

}
