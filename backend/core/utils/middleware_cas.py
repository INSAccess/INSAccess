import logging

logger = logging.getLogger(__name__)

class UserProfileMiddleware(MiddlewareMixin):
    """
    Middleware to ensure UserProfile exists for authenticated users
    """
    
    def process_request(self, request):
        # Only check for authenticated users
        if request.user.is_authenticated:
            # Check if user has a profile
            if not hasattr(request.user, 'userprofile') or not UserProfile.objects.filter(user=request.user).exists():
                try:
                    # Create UserProfile if it doesn't exist
                    default_theme = EnumColorTheme.objects.filter(name="system").first()
                    UserProfile.objects.get_or_create(
                        user=request.user,
                        defaults={'color_theme': default_theme}
                    )
                    logger.info(f"Created UserProfile for user: {request.user.username}")
                except Exception as e:
                    logger.error(f"Error creating UserProfile for {request.user.username}: {e}")
        
        return None