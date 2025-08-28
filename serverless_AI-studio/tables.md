
Company Table
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "plan",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'free'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'individual'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "subscription_plan",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'starter'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_business_account_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_ad_account_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_access_token_encrypted",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_connection_status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'not_connected'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_payment_verified",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_account_details",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_connected_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_last_verified",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_payment_threshold",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 10,
    "numeric_scale": 2
  },
  {
    "column_name": "meta_daily_spend_limit",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 10,
    "numeric_scale": 2
  },
  {
    "column_name": "business_address",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "business_phone",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "business_email",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "business_license",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_page_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_token_refreshed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]


Accounts
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "phone_number",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "username",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "password_hash",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "first_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "last_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_from_lead_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "interested_listing_ids",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

ai_brand_analysis
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "analysis_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "input_data",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_response",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_kit_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processing_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "tokens_used",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
ai_brand_suggestions
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_kit_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "suggestion_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "suggestion",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "priority",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'medium'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "applied_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

ai_editing_videos
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_video_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "editing_style",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_talking_video",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_one_person_video",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_video_size",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "credits_used",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
ai_generated_content
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "output_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "language_code",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'en'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
ai_generation_jobs
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "job_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'queued'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "priority",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'normal'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "parameters",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": "'{}'::jsonb",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "result_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "external_job_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_provider",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "progress_percentage",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "estimated_duration",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "estimated_completion",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processing_time_seconds",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 10,
    "numeric_scale": 3
  },
  {
    "column_name": "error_message",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processing_by",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
ai_generation_metadata
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_project_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_provider",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'openai'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "model_used",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "tokens_consumed",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "processing_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "cost_cents",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "input_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_response",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "error_details",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "confidence_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "user_rating",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

ai_job_dashboard
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "job_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "priority",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "progress_percentage",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "ai_provider",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processing_time_seconds",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 10,
    "numeric_scale": 3
  },
  {
    "column_name": "user_email",
    "data_type": "character varying",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": 255,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
ai_media_dashboard
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "project_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_category",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "input_prompt",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_address",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_price",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_kit_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_theme",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "assets_count",
    "data_type": "bigint",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 64,
    "numeric_scale": 0
  },
  {
    "column_name": "ai_provider",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "tokens_consumed",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "processing_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "cost_cents",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "confidence_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "user_rating",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_by_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
ai_model_costs
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "provider",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "model_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "cost_per_1k_tokens",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 6
  },
  {
    "column_name": "cost_per_1k_output_tokens",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 6
  },
  {
    "column_name": "cost_per_request",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 4
  },
  {
    "column_name": "avg_response_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "success_rate",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 5,
    "numeric_scale": 2
  },
  {
    "column_name": "last_updated",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
ai_shorts_videos
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "visual_style",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script_text",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "accent_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "credits_used",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
analytics_events
[
  {
    "column_name": "event_ts",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "event_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "payload",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
analytics_events_2025_06
[
  {
    "column_name": "event_ts",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "event_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "payload",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
async_jobs
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "job_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "payload",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "result",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "error_message",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "started_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
brand_assets
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_kit_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "asset_kind",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "storage_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "alt_text",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
brand_kits
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_default",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "theme",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "voice",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "website_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_generated",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_insights",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "confidence_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "video_config",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
brand_variations
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "parent_brand_kit_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "use_case",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "theme",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "voice_adjustments",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
company_memberships
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "role",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'agent'::user_role",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "joined_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
content_assets_tags
[
  {
    "column_name": "asset_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "tag_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
content_assets
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "project_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "asset_kind",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "asset_url",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "metadata",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
content_projects
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "project_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'draft'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "output_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "input_prompt",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_kit_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_category",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_params",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_processing_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  }
]
content_variations
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "automation_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variation_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_ad_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variation_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "messaging_angle",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "target_audience",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "inspiration_source",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "gpt_prompt_used",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "expected_improvement",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "actual_improvement",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 5,
    "numeric_scale": 2
  },
  {
    "column_name": "performance_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "test_start_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "test_end_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "test_status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "statistical_significance",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 5,
    "numeric_scale": 4
  },
  {
    "column_name": "confidence_level",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 5,
    "numeric_scale": 2
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
design_library
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "automation_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variation_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta_ad_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variation_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "messaging_angle",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "target_audience",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "inspiration_source",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "gpt_prompt_used",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "expected_improvement",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "actual_improvement",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 5,
    "numeric_scale": 2
  },
  {
    "column_name": "performance_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "test_start_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "test_end_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "test_status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "statistical_significance",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 5,
    "numeric_scale": 4
  },
  {
    "column_name": "confidence_level",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 5,
    "numeric_scale": 2
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
custom_fields
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "target_table",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "field_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "field_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_required",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

gpt_usage_tracking
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "automation_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "function_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "prompt_tokens",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "completion_tokens",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "total_tokens",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "estimated_cost",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 4
  },
  {
    "column_name": "optimization_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "cache_hit",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "cache_key",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "response_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "success",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "error_details",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "daily_total",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 2
  },
  {
    "column_name": "company_daily_total",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 2
  },
  {
    "column_name": "timestamp",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

headshots
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_kit_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "image_url",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "uploaded_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
library_assets
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "item_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
link_based_videos
[
  {
    "column_name": "video_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "thumbnail_storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_credits",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "video_created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processed_link_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "creatify_link_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_summary",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_industry",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_target_audiences",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "total_videos_from_link",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "link_analysis_credits",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
listings
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "address",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "price",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "beds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "baths",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "sqft",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "imported",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "import_source",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "enriched_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "last_enriched_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "property_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'single_family'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'sale'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_agent_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "mls_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "mls_source",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "city",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "state",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "zip_code",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "price_formatted",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "bedrooms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "bathrooms",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 1
  },
  {
    "column_name": "lot_size",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 10,
    "numeric_scale": 2
  },
  {
    "column_name": "year_built",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "listing_date",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": "CURRENT_DATE",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "expiration_date",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "images",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "videos",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "virtual_tour_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "floor_plan_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "key_features",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "neighborhood_highlights",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "school_district",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "hoa_fee",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 2
  },
  {
    "column_name": "property_taxes",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 10,
    "numeric_scale": 2
  },
  {
    "column_name": "seo_title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "seo_description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "marketing_headline",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_metadata",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
media_assets
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "asset_kind",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "storage_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "metadata",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "upload_order",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "is_primary",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_job_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
processed_links
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "asset_kind",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "storage_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "metadata",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "upload_order",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "is_primary",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_job_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
tasks
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "assigned_to",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "related_lead_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "due_date",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'pending'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
user_sessions
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "login_time",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "logout_time",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
user_style_preferences
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "preferred_styles",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": "'{}'::uuid[]",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "avoided_styles",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": "'{}'::uuid[]",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "preferred_tags",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": "'{}'::text[]",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "preferred_colors",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "last_style_used",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "avg_session_duration",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
users
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "email",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "password_hash",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "full_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "default_company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "role",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'viewer'::user_role",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "auth_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "license_number",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "max_concurrent_calls",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "3",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "call_priority_setting",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'fresh_leads'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "elevenlabs_agent_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "preferred_voice_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'JBFqnCBsd6RMkjVDRZzb'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "agent_personality",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "google_calendar_token",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "calendar_integration_enabled",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "first_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "last_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "phone",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "profile_image_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "can_create_campaigns",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "can_view_all_company_leads",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "can_manage_payments",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "can_access_analytics",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "personal_bio",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "specializations",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "social_media_links",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
video_generation_queue
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_generation_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "priority",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "5",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "scheduled_for",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "started_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "worker_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processing_logs",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
video_generations
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "campaign_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "template_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "creatify_job_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "creatify_endpoint",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "thumbnail_storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "preview_storage_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_asset_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "thumbnail_asset_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "preview_asset_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_config",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_kit_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "credits_used",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "platform",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "aspect_ratio",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "error_message",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "retry_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processed_link_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "visual_style",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script_text",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "accent_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_video_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "editing_style",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_talking_video",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_one_person_video",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_video_size",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "product_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "image_prompt",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "video_prompt",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "motion_style",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "product_showcase_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generated_photo_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_stage",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "regen_source_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "regen_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
video_scripts
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script_text",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_generated",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_prompt",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "has_variables",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variable_placeholders",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "usage_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "avg_performance_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_provider",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'internal'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_cost",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": "0.00",
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 4
  },
  {
    "column_name": "model_used",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "tokens_used",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "generation_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "quality_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "property_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "target_market",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "estimated_word_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  }
]
video_templates
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script_text",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ai_generated",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_prompt",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "has_variables",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variable_placeholders",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "usage_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "avg_performance_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_provider",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'internal'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_cost",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": "0.00",
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 4
  },
  {
    "column_name": "model_used",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "tokens_used",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "generation_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "quality_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "property_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "target_market",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "estimated_word_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  }
]
virtual_tours
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "tour_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generated_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "ready",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "meta",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
script_templates
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "category",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "prompt_template",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "example_output",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "target_duration",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "recommended_model",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'gpt-4o'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "temperature",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": "0.7",
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "max_tokens",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "500",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "usage_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "avg_quality_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "avg_generation_cost",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 4
  },
  {
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_public",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
style_generation_history
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "style_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_job_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variation_mode",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "custom_modifications",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "final_front_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "final_back_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_rating",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "user_feedback",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "was_downloaded",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "was_printed",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_time_seconds",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "credits_charged",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "2",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
script_generation_analytics
[
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_provider",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "model_used",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "script_count",
    "data_type": "bigint",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 64,
    "numeric_scale": 0
  },
  {
    "column_name": "total_cost",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "avg_cost_per_script",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "avg_generation_time_ms",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "avg_quality_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "estimated_savings",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "total_tokens_used",
    "data_type": "bigint",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 64,
    "numeric_scale": 0
  },
  {
    "column_name": "month_year",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

script_templates
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "category",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "prompt_template",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "example_output",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "target_duration",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "recommended_model",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'gpt-4o'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "temperature",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": "0.7",
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "max_tokens",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "500",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "usage_count",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "avg_quality_score",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 3,
    "numeric_scale": 2
  },
  {
    "column_name": "avg_generation_cost",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 8,
    "numeric_scale": 4
  },
  {
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_public",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
style_generation_history
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "style_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_job_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "content_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "brand_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "variation_mode",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "custom_modifications",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "final_front_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "final_back_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "user_rating",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "user_feedback",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "was_downloaded",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "was_printed",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "generation_time_seconds",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "credits_charged",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "2",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
import_dashboard
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "import_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "photos_imported",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "tour_requested",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processing_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "listing_title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_address",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_price",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "imported_by",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "actual_processing_time_ms",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
import_history
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "import_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "source_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "input_data",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "extracted_data",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "listing_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'processing'::text",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "error_message",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "photos_imported",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "tour_requested",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "processing_time_ms",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]
import_configurations
[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "import_sources",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "schedule",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "filters",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "last_run_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

