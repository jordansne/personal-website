provider "aws" {
  profile = "default"
  region = var.aws_region
}

# Bucket & CloudFront resources

resource "aws_s3_bucket" "personal_site" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_policy" "personal_site" {
  bucket = aws_s3_bucket.personal_site.bucket
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "s3:GetObject",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.personal_site.id}"
      },
      "Resource": "${aws_s3_bucket.personal_site.arn}/*"
    },
    {
      "Action": "s3:ListBucket",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.personal_site.id}"
      },
      "Resource": "${aws_s3_bucket.personal_site.arn}"
    }
  ]
}
EOF
}

resource "aws_cloudfront_origin_access_identity" "personal_site" {
  comment = "access-identity-${aws_s3_bucket.personal_site.bucket_regional_domain_name}"
}

resource "aws_cloudfront_distribution" "personal_site" {
  default_root_object = "index.html"
  enabled = true
  is_ipv6_enabled = true

  aliases = [
    var.domain,
    var.alt_domain
  ]

  origin {
    domain_name = aws_s3_bucket.personal_site.bucket_regional_domain_name
    origin_id   = var.origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.personal_site.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = var.origin_id
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.second_level.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# Primary Domain Route 53 resources

resource "aws_route53_record" "cloudfront" {
  zone_id = var.route53_zone_id
  name    = var.domain
  type    = "A"

  alias {
    name = aws_cloudfront_distribution.personal_site.domain_name
    zone_id = aws_cloudfront_distribution.personal_site.hosted_zone_id
    evaluate_target_health = false
  }
}

# Alternate Domain Route 53 resources

resource "aws_route53_zone" "alt" {
  name = var.alt_domain
}

resource "aws_route53_record" "alt_cloudfront" {
  zone_id = aws_route53_zone.alt.zone_id
  name    = var.alt_domain
  type    = "A"

  alias {
    name = aws_cloudfront_distribution.personal_site.domain_name
    zone_id = aws_cloudfront_distribution.personal_site.hosted_zone_id
    evaluate_target_health = false
  }
}

# Certificate resources

resource "aws_acm_certificate" "second_level"  {
  domain_name       = var.domain
  subject_alternative_names = [
    var.alt_domain
  ]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "second_level_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.second_level.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = dvo.domain_name == var.domain ? var.route53_zone_id : aws_route53_zone.alt.zone_id
    }
  }

  name = each.value.name
  records = [ each.value.record ]
  type = each.value.type
  zone_id = each.value.zone_id
  ttl = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "second_level" {
  certificate_arn         = aws_acm_certificate.second_level.arn
  validation_record_fqdns = [
    for record in aws_route53_record.second_level_cert_validation : record.fqdn
  ]
}
