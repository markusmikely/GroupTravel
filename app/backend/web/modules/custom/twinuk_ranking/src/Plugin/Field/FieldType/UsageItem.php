<?php

namespace Drupal\twinuk_ranking\Plugin\Field\FieldType;

use Drupal\Component\Utility\Random;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'usage_item' field type.
 *
 * @FieldType(
 *   id = "usage_item",
 *   label = @Translation("Usage item"),
 *   description = @Translation("This field will calculate and store the usage rank"),
 *   default_widget = "usage_widget",
 *   default_formatter = "usage_formatter"
 * )
 */
class UsageItem extends FieldItemBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultStorageSettings() {
    return [
      'max_length' => 255,
      'is_ascii' => FALSE,
      'case_sensitive' => FALSE,
    ] + parent::defaultStorageSettings();
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    // Prevent early t() calls by using the TranslatableMarkup.
    $properties['popularity'] = DataDefinition::create('float')
      ->setLabel(new TranslatableMarkup('Popularity'))
      ->setDescription('Total unique attraction views')
      ->setSettings(array(
        'default_value' => 0,
    ));
    // Prevent early t() calls by using the TranslatableMarkup.
    $properties['upsell'] = DataDefinition::create('float')
      ->setLabel(new TranslatableMarkup('Upsell'))
      ->setDescription('Total Number of save request')
      ->setSettings(array(
        'default_value' => 0,
      ));
    // Prevent early t() calls by using the TranslatableMarkup.
    $properties['views'] = DataDefinition::create('float')
      ->setLabel(new TranslatableMarkup('Views'))
      ->setDescription('Total unique attraction views')
      ->setSettings(array(
        'default_value' => 0,
    ));
    // Prevent early t() calls by using the TranslatableMarkup.
    $properties['saves'] = DataDefinition::create('float')
      ->setLabel(new TranslatableMarkup('Saves'))
      ->setDescription('Total Number of save request')
      ->setSettings(array(
        'default_value' => 0,
      ));
      // Prevent early t() calls by using the TranslatableMarkup.
      $properties['quotes'] = DataDefinition::create('float')
        ->setLabel(new TranslatableMarkup('Quotes'))
        ->setDescription('Total number of quote requests')
        ->setSettings(array(
          'default_value' => 0,
      ));
      $properties['rank'] = DataDefinition::create('float')
        ->setLabel(new TranslatableMarkup('Quotes'))
        ->setDescription('Total number of quote requests')
        ->setSettings(array(
          'default_value' => 0,
      ));
      $properties['updated'] = DataDefinition::create('float')
        ->setLabel(new TranslatableMarkup('Updated'))
        ->setDescription('Total number of quote requests')
        ->setSettings(array(
          'default_value' => 0,
      ));
      // Prevent early t() calls by using the TranslatableMarkup.
      $properties['value'] = DataDefinition::create('float')
        ->setLabel(new TranslatableMarkup('Usage Rank'))
        ->setDescription('description of usage rank')
        ->setComputed(TRUE)
        ->setClass('\Drupal\twinuk_ranking\CalculateUsageRank')
        ->setSettings(array(
          'default_value' => 0,
      ));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $schema = [
      'columns' => [
        'popularity' => [
          'type' => 'float',
          'precision' => 18,
          'scale' => 12,
          'not null' => FALSE,
          'default' =>0,
        ],
        'upsell' => [
          'type' => 'float',
          'precision' => 18,
          'scale' => 12,
          'not null' => FALSE,
          'default' =>0,
        ],
        'views' => [
          'type' => 'float',
          'precision' => 18,
          'scale' => 12,
          'not null' => FALSE,
          'default' =>0,
        ],
        'saves' => [
          'type' => 'float',
          'precision' => 18,
          'scale' => 12,
          'not null' => FALSE,
          'default' =>0,
        ],
        'quotes' => [
          'type' => 'float',
          'precision' => 18,
          'scale' => 12,
          'not null' => FALSE,
          'default' =>0,
        ],
        'updated' => [
          'type' => 'int',
          'not null' => FALSE,
          'default' =>0,
        ],
        'rank' => [
          'type' => 'float',
          'precision' => 18,
          'scale' => 12,
          'not null' => FALSE,
          'default' =>0,
        ],
      ],
    ];

    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  public function getConstraints() {
    $constraints = parent::getConstraints();

    // if ($max_length = $this->getSetting('max_length')) {
    //   $constraint_manager = \Drupal::typedDataManager()->getValidationConstraintManager();
    //   $constraints[] = $constraint_manager->create('ComplexData', [
    //     'value' => [
    //       'Length' => [
    //         'max' => $max_length,
    //         'maxMessage' => t('%name: may not be longer than @max characters.', [
    //           '%name' => $this->getFieldDefinition()->getLabel(),
    //           '@max' => $max_length
    //         ]),
    //       ],
    //     ],
    //   ]);
    // }

    return $constraints;
  }

  /**
   * {@inheritdoc}
   */
  public static function generateSampleValue(FieldDefinitionInterface $field_definition) {
    $random = new Random();
    $values['value'] = 0;//$random->word(mt_rand(1, $field_definition->getSetting('max_length')));
    return $values;
  }

  /**
   * {@inheritdoc}
   */
  public function storageSettingsForm(array &$form, FormStateInterface $form_state, $has_data) {
    $elements = [];

    $elements['max_length'] = [
      '#type' => 'number',
      '#title' => t('Maximum length'),
      '#default_value' => $this->getSetting('max_length'),
      '#required' => TRUE,
      '#description' => t('The maximum length of the field in characters.'),
      '#min' => 1,
      '#disabled' => $has_data,
    ];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $value = $this->get('value')->getValue();
    return $value === NULL || $value === '';
  }

}
