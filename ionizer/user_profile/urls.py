from django.urls import include, path
from rest_framework_nested import routers

from .views import (
    AwardViewSet,
    BountyViewSet,
    ChallengeViewSet,
    EducationViewSet,
    ExperienceViewSet,
    MyProfileViewSet,
    PortfolioViewSet,
    PresentationViewSet,
    ProfileLinkViewSet,
    ProfileSkillViewSet,
    ProfileViewSet,
    ProjectViewSet,
    SkillViewSet,
)

profile_router = routers.DefaultRouter()
profile_router.register(r"profile", ProfileViewSet, basename="user")
profile_router.register(r"user", MyProfileViewSet, basename="user")

portfolio_router = routers.DefaultRouter()
portfolio_router.register(r"portfolio", PortfolioViewSet, basename="portfolio")
portfolio_router.register(r"portfolio_skills", SkillViewSet, basename="user-skill")
portfolio_router.register(r"user/portfolio/skills", ProfileSkillViewSet, basename="user-portfolio-skill")
portfolio_router.register(r"user/portfolio/links", ProfileLinkViewSet, basename="user-portfolio-link")
portfolio_router.register(r"user/portfolio/experiences", ExperienceViewSet, basename="user-portfolio-experience")
portfolio_router.register(r"user/portfolio/presentations", PresentationViewSet, basename="user-portfolio-presentation")
portfolio_router.register(r"user/portfolio/educations", EducationViewSet, basename="user-portfolio-education")
portfolio_router.register(r"user/portfolio/awards", AwardViewSet, basename="user-portfolio-award")
portfolio_router.register(r"user/portfolio/projects", ProjectViewSet, basename="user-portfolio-project")
portfolio_router.register(r"user/portfolio/challenges", ChallengeViewSet, basename="user-portfolio-challenge")
portfolio_router.register(r"user/portfolio/bounties", BountyViewSet, basename="user-portfolio-bounty")

urlpatterns = [
    path("", include(profile_router.urls)),
    path("", include(portfolio_router.urls)),
]
