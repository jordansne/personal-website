variable "aws_region" {
  description = "AWS region for resources"
  default     = "us-east-1"
}

variable "domain" {
  description = "Domain for the site"
  default     = "jordansne.com"
}

variable "alt_domain" {
  description = "Alternate domain for the site"
  default     = "jordanmathewson.com"
}

variable "route53_zone_id" {
  description = "Existing Route 53 Zone ID of the domain"
  default     = "Z0200204J1XT21XC0IU"
}

variable "bucket_name" {
  description = "Bucket name for the static site files"
  default     = "jordansne-personal-site"
}

variable "origin_id" {
  description = "CloudFront Origin ID for the site"
  default     = "S3-jordansne-site"
}
