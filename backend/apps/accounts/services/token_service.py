from rest_framework.authtoken.models import Token


def issue_token(user):
    """Issue (or return existing) token string for a user."""
    token, _ = Token.objects.get_or_create(user=user)
    return token.key


def revoke_token(user):
    """Revoke the current token for a user."""
    Token.objects.filter(user=user).delete()


def revoke_all_tokens(user):
    """Revoke all tokens for a user (used after password reset)."""
    Token.objects.filter(user=user).delete()