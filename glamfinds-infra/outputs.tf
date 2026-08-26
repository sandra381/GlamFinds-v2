output "bucket_name" {
  description = "Name of the provisioned S3 bucket"
  value       = aws_s3_bucket.main.bucket
}

output "bucket_arn" {
  description = "ARN of the provisioned S3 bucket"
  value       = aws_s3_bucket.main.arn
}

output "bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.main.bucket_domain_name
}

output "iam_user_name" {
  description = "Name of the IAM user created"
  value       = aws_iam_user.s3_user.name
}

output "iam_access_key_id" {
  description = "Access Key ID for the IAM user"
  value       = aws_iam_access_key.s3_user.id
  sensitive   = true
}

output "iam_secret_access_key" {
  description = "Secret Access Key for the IAM user"
  value       = aws_iam_access_key.s3_user.secret
  sensitive   = true
}