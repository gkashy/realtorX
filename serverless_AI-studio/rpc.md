[
  {
    "function_name": "add_audit_trigger_to_table",
    "return_type": "void",
    "arguments": "table_name text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "add_tag_to_asset",
    "return_type": "void",
    "arguments": "_asset_id uuid, _tag_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "add_timestamp_trigger_to_table",
    "return_type": "void",
    "arguments": "table_name text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "add_updated_at_trigger",
    "return_type": "void",
    "arguments": "table_name text, schema_name text DEFAULT 'public'::text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_campaign_control",
    "return_type": "jsonb",
    "arguments": "p_campaign_id uuid DEFAULT NULL::uuid, p_action text DEFAULT NULL::text, p_options jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_campaign_control_bulk",
    "return_type": "jsonb",
    "arguments": "p_campaign_ids uuid[], p_action text, p_options jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_campaign_create_ai",
    "return_type": "jsonb",
    "arguments": "p_property_id uuid, p_campaign_structure jsonb, p_campaign_type text, p_gpt_metadata jsonb DEFAULT NULL::jsonb, p_original_request jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_campaign_store_ai",
    "return_type": "jsonb",
    "arguments": "p_property_id uuid, p_campaign_structure jsonb, p_gpt_metadata jsonb DEFAULT NULL::jsonb, p_original_request jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_company_meta_connect",
    "return_type": "jsonb",
    "arguments": "p_meta_access_token text, p_meta_business_account_id text, p_meta_ad_account_id text, p_meta_account_details jsonb DEFAULT '{}'::jsonb, p_user_agent text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_lead_management",
    "return_type": "jsonb",
    "arguments": "_operation text, _lead_id uuid DEFAULT NULL::uuid, _company_id uuid DEFAULT NULL::uuid, _lead_data jsonb DEFAULT NULL::jsonb, _new_status lead_status_tp DEFAULT NULL::lead_status_tp, _status_reason text DEFAULT NULL::text, _new_assigned_realtor_id uuid DEFAULT NULL::uuid, _assignment_reason text DEFAULT NULL::text, _activity_type text DEFAULT NULL::text, _subject text DEFAULT NULL::text, _description text DEFAULT NULL::text, _notes text DEFAULT NULL::text, _property_id uuid DEFAULT NULL::uuid, _interest_type text DEFAULT NULL::text, _interest_level text DEFAULT NULL::text, _interaction_data jsonb DEFAULT NULL::jsonb, _filters jsonb DEFAULT NULL::jsonb, _pagination jsonb DEFAULT NULL::jsonb, _include_activities boolean DEFAULT false, _include_property_interests boolean DEFAULT false",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_meta_payment_verify",
    "return_type": "jsonb",
    "arguments": "p_payment_verification_data jsonb, p_daily_spend_limit numeric DEFAULT NULL::numeric, p_payment_threshold numeric DEFAULT NULL::numeric, p_force_verification boolean DEFAULT false, p_user_agent text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "api_notification_system",
    "return_type": "jsonb",
    "arguments": "_action text, _user_id uuid DEFAULT NULL::uuid, _company_id uuid DEFAULT NULL::uuid, _notification_type text DEFAULT NULL::text, _title text DEFAULT NULL::text, _message text DEFAULT NULL::text, _data jsonb DEFAULT NULL::jsonb, _priority text DEFAULT 'medium'::text, _notification_id uuid DEFAULT NULL::uuid, _limit_count integer DEFAULT 50, _offset_count integer DEFAULT 0",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "apply_timestamp_triggers_to_all_tables",
    "return_type": "void",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "archive_library_asset",
    "return_type": "void",
    "arguments": "p_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "begin_transaction",
    "return_type": "void",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "calculate_script_cost",
    "return_type": "numeric",
    "arguments": "provider_name text, model_name text, input_tokens integer DEFAULT 0, output_tokens integer DEFAULT 0, company_uuid uuid DEFAULT NULL::uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "call_automation_scheduler_safe",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "can_upload_to_listing",
    "return_type": "boolean",
    "arguments": "listing_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "check_timestamp_triggers",
    "return_type": "TABLE(table_name text, trigger_name text, trigger_timing text, has_updated_at_column boolean)",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "citext",
    "return_type": "citext",
    "arguments": "inet",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext",
    "return_type": "citext",
    "arguments": "character",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext",
    "return_type": "citext",
    "arguments": "boolean",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_cmp",
    "return_type": "integer",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_eq",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_ge",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_gt",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_hash",
    "return_type": "integer",
    "arguments": "citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_hash_extended",
    "return_type": "bigint",
    "arguments": "citext, bigint",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_larger",
    "return_type": "citext",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_le",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_lt",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_ne",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_pattern_cmp",
    "return_type": "integer",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_pattern_ge",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_pattern_gt",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_pattern_le",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_pattern_lt",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citext_smaller",
    "return_type": "citext",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citextin",
    "return_type": "citext",
    "arguments": "cstring",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citextout",
    "return_type": "cstring",
    "arguments": "citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "citextrecv",
    "return_type": "citext",
    "arguments": "internal",
    "volatility": "STABLE"
  },
  {
    "function_name": "citextsend",
    "return_type": "bytea",
    "arguments": "citext",
    "volatility": "STABLE"
  },
  {
    "function_name": "cleanup_audit_logs",
    "return_type": "bigint",
    "arguments": "p_days_to_keep integer DEFAULT 365",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "cleanup_test_data",
    "return_type": "jsonb",
    "arguments": "company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "clear_audit_user_context",
    "return_type": "void",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "commit_transaction",
    "return_type": "void",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "confirm_brand_asset_upload",
    "return_type": "uuid",
    "arguments": "brand_kit_id uuid, storage_path text, asset_kind text, alt_text text DEFAULT NULL::text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "count_content_projects",
    "return_type": "integer",
    "arguments": "_filter jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "create_ai_content_project",
    "return_type": "uuid",
    "arguments": "p_project_data jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "create_company_with_owner_legacy",
    "return_type": "uuid",
    "arguments": "company_name text, user_auth_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "create_sample_processed_link",
    "return_type": "uuid",
    "arguments": "company_uuid uuid, user_uuid uuid, sample_url text DEFAULT 'https://www.realtor.ca/sample-listing'::text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "current_company_id",
    "return_type": "uuid",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "delete_ai_generated_content",
    "return_type": "void",
    "arguments": "_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "delete_brand_kit",
    "return_type": "void",
    "arguments": "p_kit_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "delete_content_assets",
    "return_type": "void",
    "arguments": "_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "delete_content_project",
    "return_type": "void",
    "arguments": "_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "delete_content_tag",
    "return_type": "void",
    "arguments": "_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "delete_library_asset",
    "return_type": "void",
    "arguments": "p_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "detect_suspicious_activity",
    "return_type": "TABLE(user_id uuid, action_count bigint, distinct_tables bigint, first_action timestamp with time zone, last_action timestamp with time zone, sample_changes jsonb)",
    "arguments": "p_hours_back integer DEFAULT 1, p_threshold integer DEFAULT 50",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "enforce_single_default_brandkit",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "ensure_company_has_default_brand_kit",
    "return_type": "uuid",
    "arguments": "p_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_campaign_structure_validate",
    "return_type": "jsonb",
    "arguments": "p_company_id uuid, p_user_id uuid, p_campaign_structure jsonb, p_campaign_type text, p_listing_id uuid DEFAULT NULL::uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_clear_other_defaults",
    "return_type": "void",
    "arguments": "company_id uuid, new_default_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_company_setup_complete",
    "return_type": "boolean",
    "arguments": "_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_property_marketing_score",
    "return_type": "jsonb",
    "arguments": "_property_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_spend_tracking_update",
    "return_type": "jsonb",
    "arguments": "p_company_id uuid, p_automation_id uuid, p_meta_spend_data jsonb, p_sync_timestamp timestamp with time zone DEFAULT now()",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_track_event",
    "return_type": "void",
    "arguments": "event_name text, payload jsonb DEFAULT '{}'::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_track_event",
    "return_type": "void",
    "arguments": "_company_id uuid, _user_id uuid, _event_name text, _payload jsonb DEFAULT '{}'::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_track_event",
    "return_type": "void",
    "arguments": "_user_id uuid, _event_name text, _payload jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "fn_update_lead",
    "return_type": "jsonb",
    "arguments": "_lead_id uuid, _user_id uuid, _company_id uuid, _updates jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_ai_content_projects",
    "return_type": "jsonb",
    "arguments": "p_company_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_project_type text DEFAULT NULL::text, p_listing_id uuid DEFAULT NULL::uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_ai_media_dashboard",
    "return_type": "jsonb",
    "arguments": "p_company_id uuid DEFAULT NULL::uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_ai_media_stats",
    "return_type": "TABLE(total_projects bigint, projects_this_month bigint, total_ai_cost_cents bigint, avg_processing_time_ms numeric, most_popular_type text, listing_vs_brand_ratio jsonb)",
    "arguments": "target_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_ai_usage_stats",
    "return_type": "TABLE(total_analyses bigint, analyses_this_month bigint, total_tokens_used bigint, avg_processing_time numeric, most_used_type text)",
    "arguments": "target_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_asset_tags",
    "return_type": "SETOF content_tags",
    "arguments": "_asset_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_assets_by_tag",
    "return_type": "SETOF content_assets",
    "arguments": "_tag_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_audit_trail",
    "return_type": "TABLE(audit_id uuid, action text, user_id uuid, change_summary jsonb, audit_timestamp timestamp with time zone)",
    "arguments": "p_table_name text, p_record_id uuid, p_limit integer DEFAULT 50",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_brand_kit_for_company",
    "return_type": "jsonb",
    "arguments": "p_brand_kit_id uuid DEFAULT NULL::uuid, p_company_id uuid DEFAULT NULL::uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_campaign_control_options",
    "return_type": "jsonb",
    "arguments": "p_campaign_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_campaign_performance",
    "return_type": "TABLE(campaign_id uuid, campaign_title text, campaign_status text, total_impressions numeric, total_clicks numeric, total_conversions numeric, total_spend numeric, click_through_rate numeric, conversion_rate numeric, cost_per_click numeric, cost_per_acquisition numeric, return_on_ad_spend numeric, performance_score numeric, days_running integer, avg_daily_spend numeric)",
    "arguments": "p_company_id uuid, p_campaign_ids uuid[] DEFAULT NULL::uuid[], p_date_from date DEFAULT NULL::date, p_date_to date DEFAULT NULL::date",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_company_library_assets_count",
    "return_type": "TABLE(item_type lib_asset_tp, count bigint)",
    "arguments": "p_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_current_user_id",
    "return_type": "uuid",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_default_brand_kit",
    "return_type": "TABLE(id uuid, name text, theme jsonb, voice text, website_url text)",
    "arguments": "target_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_listing_with_media",
    "return_type": "jsonb",
    "arguments": "p_listing_id uuid, p_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_media_public_url",
    "return_type": "text",
    "arguments": "storage_path text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_metric_summary",
    "return_type": "TABLE(metric_name text, current_period_value numeric, previous_period_value numeric, percentage_change numeric, trend_direction text, total_campaigns integer, active_campaigns integer, period_start_date date, period_end_date date)",
    "arguments": "p_company_id uuid, p_period_days integer DEFAULT 30, p_metric_names text[] DEFAULT ARRAY['impressions'::text, 'clicks'::text, 'conversions'::text, 'spend'::text]",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_metric_summary",
    "return_type": "TABLE(metric text, total_value numeric, average_value numeric, min_value numeric, max_value numeric)",
    "arguments": "_campaign_id uuid, _start_date date DEFAULT NULL::date, _end_date date DEFAULT NULL::date, _metric text DEFAULT NULL::text",
    "volatility": "STABLE"
  },
  {
    "function_name": "get_pending_ai_jobs",
    "return_type": "TABLE(id uuid, job_type text, parameters jsonb, priority text, created_at timestamp with time zone)",
    "arguments": "limit_count integer DEFAULT 10",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_project_stats_by_status",
    "return_type": "TABLE(status text, count bigint)",
    "arguments": "_company_id uuid DEFAULT NULL::uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_project_stats_by_type",
    "return_type": "TABLE(project_type tour_type_tp, count bigint)",
    "arguments": "_company_id uuid DEFAULT NULL::uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_unread_notifications",
    "return_type": "TABLE(id uuid, message text, type text, created_at timestamp with time zone, priority_score integer)",
    "arguments": "p_user_id uuid, p_limit integer DEFAULT 50",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_unread_notifications",
    "return_type": "TABLE(id uuid, message text, type text, created_at timestamp with time zone)",
    "arguments": "",
    "volatility": "STABLE"
  },
  {
    "function_name": "get_upcoming_events",
    "return_type": "TABLE(id uuid, title text, description text, start_time timestamp with time zone, end_time timestamp with time zone, location text)",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_upcoming_events",
    "return_type": "TABLE(id uuid, title text, description text, start_time timestamp with time zone, end_time timestamp with time zone, location text, days_until_event integer, is_today boolean, is_this_week boolean)",
    "arguments": "p_user_id uuid, p_days_ahead integer DEFAULT 30",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_user_ai_jobs",
    "return_type": "TABLE(id uuid, job_type text, status text, progress_percentage integer, ai_provider text, created_at timestamp with time zone, estimated_completion timestamp with time zone, listing_title text)",
    "arguments": "p_user_id uuid DEFAULT auth.uid(), p_status text DEFAULT NULL::text, p_limit integer DEFAULT 20",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_user_audit_trail",
    "return_type": "TABLE(audit_id uuid, action text, target_table text, target_id uuid, change_summary jsonb, audit_timestamp timestamp with time zone)",
    "arguments": "p_user_id uuid, p_hours_back integer DEFAULT 24, p_limit integer DEFAULT 100",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_user_context",
    "return_type": "TABLE(id uuid, default_company_id uuid, company_id uuid, role user_role)",
    "arguments": "user_auth_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_user_context",
    "return_type": "TABLE(user_id uuid, company_id uuid, user_role user_role)",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_user_role_in_company",
    "return_type": "user_role",
    "arguments": "target_company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "get_workflow_readiness",
    "return_type": "TABLE(workflow_name text, table_exists boolean, required_fields_present boolean, constraint_updated boolean, overall_status text)",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "handle_new_user",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "increment_link_video_count",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "increment_template_usage",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "insert_ai_generated_content",
    "return_type": "uuid",
    "arguments": "_input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "insert_ai_media_project",
    "return_type": "uuid",
    "arguments": "_input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "insert_brand_kit",
    "return_type": "uuid",
    "arguments": "data jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "insert_content_assets",
    "return_type": "uuid",
    "arguments": "_input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "insert_content_project",
    "return_type": "uuid",
    "arguments": "_input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "insert_content_tag",
    "return_type": "uuid",
    "arguments": "_input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "insert_library_asset",
    "return_type": "uuid",
    "arguments": "data jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "inspect_company_memberships",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "inspect_tables",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "invite_user_to_company",
    "return_type": "text",
    "arguments": "company_id uuid, email citext, role user_role",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "invoke_lead_assignment",
    "return_type": "json",
    "arguments": "_lead_id uuid, _assignment_reason text DEFAULT 'auto'::text, _force_reassign boolean DEFAULT false",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "invoke_lead_attribution",
    "return_type": "json",
    "arguments": "_external_campaign_id text DEFAULT NULL::text, _external_adset_id text DEFAULT NULL::text, _external_ad_id text DEFAULT NULL::text, _lead_id uuid DEFAULT NULL::uuid, _company_id uuid DEFAULT NULL::uuid, _include_lead_details boolean DEFAULT true, _include_property_interests boolean DEFAULT true, _date_from timestamp with time zone DEFAULT NULL::timestamp with time zone, _date_to timestamp with time zone DEFAULT NULL::timestamp with time zone, _limit_results integer DEFAULT 100",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "invoke_lead_scoring",
    "return_type": "json",
    "arguments": "_lead_id uuid DEFAULT NULL::uuid, _company_id uuid DEFAULT NULL::uuid, _recalculate_all boolean DEFAULT false, _update_database boolean DEFAULT true, _include_scoring_breakdown boolean DEFAULT true, _benchmark_against_company boolean DEFAULT true, _limit_results integer DEFAULT 100",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "is_member_of_company",
    "return_type": "boolean",
    "arguments": "_company uuid",
    "volatility": "STABLE"
  },
  {
    "function_name": "jsonb_object_keys_count",
    "return_type": "integer",
    "arguments": "input_jsonb jsonb",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "log_ai_analysis",
    "return_type": "uuid",
    "arguments": "p_company_id uuid, p_analysis_type text, p_input_data jsonb, p_ai_response jsonb, p_brand_kit_id uuid DEFAULT NULL::uuid, p_processing_time_ms integer DEFAULT NULL::integer, p_tokens_used integer DEFAULT NULL::integer",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "notify_ai_job_completion",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "publish_library_asset",
    "return_type": "void",
    "arguments": "p_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "queue_ai_generation_job",
    "return_type": "uuid",
    "arguments": "p_company_id uuid, p_user_id uuid, p_job_type text, p_parameters jsonb DEFAULT '{}'::jsonb, p_listing_id uuid DEFAULT NULL::uuid, p_priority text DEFAULT 'normal'::text, p_ai_provider text DEFAULT NULL::text, p_estimated_duration integer DEFAULT NULL::integer",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "regexp_match",
    "return_type": "text[]",
    "arguments": "citext, citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_match",
    "return_type": "text[]",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_matches",
    "return_type": "SETOF text[]",
    "arguments": "citext, citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_matches",
    "return_type": "SETOF text[]",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_replace",
    "return_type": "text",
    "arguments": "citext, citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_replace",
    "return_type": "text",
    "arguments": "citext, citext, text, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_split_to_array",
    "return_type": "text[]",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_split_to_array",
    "return_type": "text[]",
    "arguments": "citext, citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_split_to_table",
    "return_type": "SETOF text",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "regexp_split_to_table",
    "return_type": "SETOF text",
    "arguments": "citext, citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "remove_tag_from_asset",
    "return_type": "void",
    "arguments": "_asset_id uuid, _tag_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "replace",
    "return_type": "text",
    "arguments": "citext, citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "rollback_transaction",
    "return_type": "void",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "safe_current_setting",
    "return_type": "text",
    "arguments": "setting_name text, missing_ok boolean DEFAULT false",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "select_ai_generated_content",
    "return_type": "SETOF ai_generated_content",
    "arguments": "_filter jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "select_brand_kits",
    "return_type": "SETOF brand_kits",
    "arguments": "filters jsonb DEFAULT '{}'::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "select_content_assets",
    "return_type": "SETOF content_assets",
    "arguments": "_filter jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "select_content_projects",
    "return_type": "SETOF content_projects",
    "arguments": "_filter jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "select_content_tags",
    "return_type": "SETOF content_tags",
    "arguments": "_filter jsonb DEFAULT NULL::jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "select_library_assets",
    "return_type": "SETOF library_assets",
    "arguments": "filters jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "set_audit_user_context",
    "return_type": "void",
    "arguments": "p_user_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "set_current_company",
    "return_type": "void",
    "arguments": "company_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "set_tenant_context",
    "return_type": "void",
    "arguments": "companyid uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "simple_test",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "split_part",
    "return_type": "text",
    "arguments": "citext, citext, integer",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "store_generated_content",
    "return_type": "uuid",
    "arguments": "p_asset_data jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "strpos",
    "return_type": "integer",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "test_edge_function_query",
    "return_type": "json",
    "arguments": "automation_uuid uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "test_event_tracking",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "test_event_tracking_debug",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "test_event_tracking_simple",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "test_timestamp_trigger",
    "return_type": "TABLE(before_update timestamp with time zone, after_update timestamp with time zone, time_diff_seconds numeric)",
    "arguments": "p_table_name text, p_record_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "texticlike",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "texticlike",
    "return_type": "boolean",
    "arguments": "citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "texticnlike",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "texticnlike",
    "return_type": "boolean",
    "arguments": "citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "texticregexeq",
    "return_type": "boolean",
    "arguments": "citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "texticregexeq",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "texticregexne",
    "return_type": "boolean",
    "arguments": "citext, citext",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "texticregexne",
    "return_type": "boolean",
    "arguments": "citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "touch_updated_at",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "track_ai_generation_usage",
    "return_type": "uuid",
    "arguments": "p_usage_data jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "translate",
    "return_type": "text",
    "arguments": "citext, citext, text",
    "volatility": "IMMUTABLE"
  },
  {
    "function_name": "trg_audit_any_change",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "trg_fn_track_lead_create",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "trg_touch_updated_at",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "trg_track_lead_creation",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "trigger_automation_scheduler",
    "return_type": "text",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_ai_generated_content",
    "return_type": "void",
    "arguments": "_id uuid, _input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_ai_job_progress",
    "return_type": "void",
    "arguments": "p_job_id uuid, p_status text DEFAULT NULL::text, p_progress integer DEFAULT NULL::integer, p_result_data jsonb DEFAULT NULL::jsonb, p_error_message text DEFAULT NULL::text",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_brand_kit",
    "return_type": "void",
    "arguments": "p_kit_id uuid, data jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_content_assets",
    "return_type": "void",
    "arguments": "_id uuid, _input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_content_project",
    "return_type": "void",
    "arguments": "_id uuid, _input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_content_tag",
    "return_type": "void",
    "arguments": "_id uuid, _input jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_library_asset",
    "return_type": "void",
    "arguments": "p_id uuid, data jsonb",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "update_modified_column",
    "return_type": "trigger",
    "arguments": "",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "user_can_access_listing",
    "return_type": "boolean",
    "arguments": "listing_id uuid",
    "volatility": "VOLATILE"
  },
  {
    "function_name": "user_in_company",
    "return_type": "boolean",
    "arguments": "target_company_id uuid",
    "volatility": "VOLATILE"
  }
]