"""
URL configuration for velt_api app
"""
from django.urls import path
from .views import (
    get_comments,
    save_comments,
    delete_comment,
    get_reactions,
    save_reactions,
    delete_reaction,
    save_attachment,
    delete_attachment,
    get_users,
    mint_token,
)

urlpatterns = [
    # Comments endpoints
    path('comments/get', get_comments, name='get_comments'),
    path('comments/save', save_comments, name='save_comments'),
    path('comments/delete', delete_comment, name='delete_comment'),
    
    # Reactions endpoints
    path('reactions/get', get_reactions, name='get_reactions'),
    path('reactions/save', save_reactions, name='save_reactions'),
    path('reactions/delete', delete_reaction, name='delete_reaction'),
    
    # Attachments endpoints
    path('attachments/save', save_attachment, name='save_attachment'),
    path('attachments/delete', delete_attachment, name='delete_attachment'),
    
    # Users endpoints
    path('users/get', get_users, name='get_users'),

    # Dev-only: mint a short-lived JWT for the resolver gate. NOT gated. NEVER ship.
    path('auth/mint', mint_token, name='mint_token'),
]

