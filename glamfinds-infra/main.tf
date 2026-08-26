# 1. Crear el bucket S3
resource "aws_s3_bucket" "main" {
  bucket = "${var.bucket_name_prefix}-${var.environment}"
  force_destroy = true # Para que puedas destruir el bucket sin errores en dev
}

# 2. Configurar bloqueo de acceso público (permitimos lectura pública)
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 3. Política del bucket para permitir lectura pública de objetos
resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id
  policy = data.aws_iam_policy_document.bucket_policy.json
}

data "aws_iam_policy_document" "bucket_policy" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.main.arn}/*"]
  }
}

# 4. Configuración CORS (permite PUT desde el frontend o backend)
resource "aws_s3_bucket_cors_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "DELETE"]
    allowed_origins = var.allowed_origins
    expose_headers = ["ETag"]
    max_age_seconds = 3000
  }
}

# 5. Configurar encripción (buena práctica)
resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 6. Habilitar versionado (opcional pero recomendado)
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Enabled"
  }
}

# 7. Crear usuario IAM con permisos de subida
resource "aws_iam_user" "s3_user" {
  name = var.iam_user_name
  path = "/"
}

# 8. Crear una clave de acceso para el usuario
resource "aws_iam_access_key" "s3_user" {
  user = aws_iam_user.s3_user.name
}

# 9. Política IAM para el usuario (permisos específicos para el bucket)
resource "aws_iam_user_policy" "s3_user" {
  name   = "s3-upload-policy"
  user   = aws_iam_user.s3_user.name
  policy = data.aws_iam_policy_document.s3_user_policy.json
}

data "aws_iam_policy_document" "s3_user_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:ListBucket"
    ]
    resources = [
      aws_s3_bucket.main.arn,
      "${aws_s3_bucket.main.arn}/*"
    ]
  }
}