import datetime
from collections import Counter

from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.http import JsonResponse
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import status, viewsets
from rest_framework.decorators import action

from achievements.models import Achievement
from achievements.serializers import AchievementSerializer
from achievements.utils import get_achievement
from activities.models import Activity
from activities.serializers import ActivitiesSerializer
from boards.models import Board, Comment, Post
from boards.serializers import CommentSerializer, PostDetailSerializer, PostSerializer

from .models import (
    Award,
    Bounty,
    Challenge,
    Education,
    Experience,
    Presentation,
    Profile,
    ProfileLink,
    ProfileSkill,
    Project,
    Skill,
)
from .serializers import (
    AwardSerializer,
    BountySerializer,
    ChallengeSerializer,
    EducationSerializer,
    ExperienceSerializer,
    PortfolioSerializer,
    PresentationSerializer,
    ProfileLinkSerializer,
    ProfileSerializer,
    ProfileSkillSerializer,
    ProjectSerializer,
    SkillSerializer,
)

UserModel = get_user_model()


class HeatmapCounter(Counter):
    def to_dict(self):
        return [{"date": k, "count": v} for k, v in self.items()]


class MyProfileViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["patch"], url_path="profile")
    def update_profile(self, request, *args, **kwargs):
        """
        Update my profile

        :method: PATCH
        :endpoint: /user/profile/
        """
        user = UserModel.objects.get(pk=request.user.id)
        profile = user.profile

        if "nickname" in request.data:
            user.nickname = request.data["nickname"]

        for field in [
            "image_url",
            "profile_url",
            "name",
            "bio",
            "affiliation",
        ]:
            if field in request.data:
                setattr(profile, field, request.data[field])

        user.save()
        profile.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["patch"], url_path="password")
    def update_password(self, request, *args, **kwargs):
        """
        Update my password

        :method: PATCH
        :endpoint: /user/password/
        """
        user = UserModel.objects.get(pk=request.user.id)
        if not user.check_password(request.data["password"]):
            return JsonResponse(
                {"status": "error", "data": {"message": "비밀번호가 틀립니다"}}, status=status.HTTP_401_UNAUTHORIZED
            )

        user.set_password(request.data["new_password"])
        user.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="")
    def resign_user(self, request, *args, **kwargs):
        """
        Resign user

        :method: DELETE
        :endpoint: /user/
        """
        user = UserModel.objects.get(pk=request.user.id)
        if not user.check_password(request.data["password"]):
            return JsonResponse(
                {"status": "error", "data": {"message": "비밀번호가 틀립니다"}}, status=status.HTTP_401_UNAUTHORIZED
            )

        user.deleted_at = timezone.now()
        user.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class ProfileViewSet(viewsets.ViewSet):
    @action(detail=True, methods=["get"])
    def popular_content(self, request, pk):
        """
        Get user popular content

        :method: GET
        :endpoint: /profile/{profile_url}/popular_content/
        """
        user = Profile.objects.get(profile_url=pk).user
        posts = Post.objects.filter(user=user).annotate(likes_count=Count("likes")).order_by("-likes_count").all()[:10]

        serializer = PostSerializer(posts, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def achievements(self, request, pk):
        """
        Get user achievements

        :method: GET
        :endpoint: /profile/{profile_url}/achievements/
        """
        user = Profile.objects.get(profile_url=pk).user
        achievements = Achievement.objects.filter(user=user).all()
        achievement_list = []

        serializer = AchievementSerializer(achievements, many=True)

        for achievement in serializer.data:
            achievement_list.append(get_achievement(achievement["type"]))

        return JsonResponse({"status": "success", "data": achievement_list}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def activities(self, request, pk):
        """
        Get user activities

        :method: GET
        :endpoint: /profile/{profile_url}/activities/
        """
        date_from = parse_datetime(request.GET.get("from", str(timezone.now() - datetime.timedelta(days=30))))
        date_to = parse_datetime(request.GET.get("to", str(timezone.now())))

        user = Profile.objects.get(profile_url=pk).user

        # date >= date_from and date <= date_to
        activities = Activity.objects.filter(created_at__range=[date_from, date_to], user=user)

        serializer = ActivitiesSerializer(activities, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def heatmap(self, request, pk):
        """
        Get user heatmap

        :method: GET
        :endpoint: /profile/{profile_url}/heatmap/
        """
        user = Profile.objects.get(profile_url=pk).user
        activities = Activity.objects.filter(user=user).all()

        serializer = ActivitiesSerializer(activities, many=True, context={"request": request})

        heatmap_data = []

        for activity in serializer.data:
            parsed_date = activity["created_at"].isoformat()[:10]
            heatmap_data.append(parsed_date)

        return JsonResponse(
            {"status": "success", "data": HeatmapCounter(heatmap_data).to_dict()}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"])
    def radar(self, request, pk):
        """
        Get user radar

        :method: GET
        :endpoint: /profile/{profile_url}/radar/
        """
        year = timezone.now().year
        user = UserModel.objects.get(id=pk)

        activity_models = [Post, Comment, Achievement]  # TODO: Attendance
        activity_group_count = []

        # activity_total = Activity.objects.filter(date__year=year, user=user).count()

        for activity_model in activity_models:
            activity_type = activity_model.__name__.lower()
            content_type = ContentType.objects.get_for_model(activity_model)
            activity_group_count.append(
                {
                    "activity": activity_type,
                    "count": Activity.objects.filter(
                        created_at__year=year, user=user, content_type__pk=content_type.id
                    ).count(),
                }
            )

        return JsonResponse({"status": "success", "data": activity_group_count}, status=status.HTTP_200_OK)


class PortfolioViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk):
        """
        Get user portfolio

        :method: GET
        :endpoint: /portfolio/{profile_url}/
        """
        profile = Profile.objects.get(profile_url=pk)

        serializer = PortfolioSerializer(profile, context={"request": request})

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def profile(self, request, pk):
        """
        Get user portfolio

        :method: GET
        :endpoint: /portfolio/{profile_url}/profile/
        """
        profile = Profile.objects.get(profile_url=pk)

        serializer = ProfileSerializer(profile, context={"request": request})

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def posts(self, request, pk):
        """
        Get user posts

        :method: GET
        :endpoint: /portfolio/{profile_url}/posts/
        """
        profile = Profile.objects.get(profile_url=pk)
        posts = profile.user.post_set.all()

        serializer = PostDetailSerializer(posts, many=True, context={"request": request})

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def answers(self, request, pk):
        """
        Get user answers

        :method: GET
        :endpoint: /portfolio/{profile_url}/answers/
        """
        profile = Profile.objects.get(profile_url=pk)
        question_boards = Board.objects.filter(type="question")
        comments = [
            {
                **CommentSerializer(comment, context={"request": request}).data,
                "post": PostDetailSerializer(comment.root_content_object, context={"request": request}).data,
            }
            for comment in profile.user.comment_set.all()
            if comment.root_content_object.category.board in question_boards
        ]

        return JsonResponse({"status": "success", "data": comments}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def skills(self, request, pk):
        """
        Get user portfolio skills

        :method: GET
        :endpoint: /portfolio/{profile_url}/skills/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_skills = profile.user.profileskill_set.all()

        data = [
            {
                **SkillSerializer(profile_skill.skill).data,
                "skill_id": profile_skill.skill.id,
                "id": profile_skill.id,
            }
            for profile_skill in profile_skills
        ]

        return JsonResponse({"status": "success", "data": data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def links(self, request, pk):
        """
        Get user portfolio links

        :method: GET
        :endpoint: /portfolio/{profile_url}/links/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_links = profile.user.profilelink_set.all()

        serializer = ProfileLinkSerializer(profile_links, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def experiences(self, request, pk):
        """
        Get user portfolio experiences

        :method: GET
        :endpoint: /portfolio/{profile_url}/experiences/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_experiences = profile.user.experience_set

        type = request.GET.get("type")

        if request.user != profile.user:
            profile_experiences = profile_experiences.filter(is_hidden=False)

        if type:
            profile_experiences = profile_experiences.filter(type=type)

        serializer = ExperienceSerializer(profile_experiences, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def presentations(self, request, pk):
        """
        Get user portfolio presentations

        :method: GET
        :endpoint: /portfolio/{profile_url}/presentations/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_presentations = profile.user.presentation_set

        if request.user != profile.user:
            profile_presentations = profile_presentations.filter(is_hidden=False)

        serializer = PresentationSerializer(profile_presentations, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def educations(self, request, pk):
        """
        Get user portfolio educations

        :method: GET
        :endpoint: /portfolio/{profile_url}/educations/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_educations = profile.user.education_set

        if request.user != profile.user:
            profile_educations = profile_educations.filter(is_hidden=False)

        serializer = EducationSerializer(profile_educations, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def awards(self, request, pk):
        """
        Get user portfolio awards

        :method: GET
        :endpoint: /portfolio/{profile_url}/awards/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_awards = profile.user.award_set

        if request.user != profile.user:
            profile_awards = profile_awards.filter(is_hidden=False)

        serializer = AwardSerializer(profile_awards, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def projects(self, request, pk):
        """
        Get user portfolio projects

        :method: GET
        :endpoint: /portfolio/{profile_url}/projects/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_projects = profile.user.project_set

        if request.user != profile.user:
            profile_projects = profile_projects.filter(is_hidden=False)

        serializer = ProjectSerializer(profile_projects, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def challenges(self, request, pk):
        """
        Get user portfolio challenges

        :method: GET
        :endpoint: /portfolio/{profile_url}/challenges/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_challenges = profile.user.challenge_set

        if request.user != profile.user:
            profile_challenges = profile_challenges.filter(is_hidden=False)

        serializer = ChallengeSerializer(profile_challenges, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def bounties(self, request, pk):
        """
        Get user portfolio bounties

        :method: GET
        :endpoint: /portfolio/{profile_url}/bounties/
        """
        profile = Profile.objects.get(profile_url=pk)
        profile_bounties = profile.user.bounty_set

        if request.user != profile.user:
            profile_bounties = profile_bounties.filter(is_hidden=False)

        serializer = BountySerializer(profile_bounties, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class SkillViewSet(viewsets.GenericViewSet):
    def get_queryset(self):
        return Skill.objects.filter(deleted_at__isnull=True).all()

    def list(self, request):
        """
        Get skills

        :method: GET
        :endpoint: /portfolio_skills/
        """
        skills = self.get_queryset()

        serializer = SkillSerializer(skills, many=True)

        return JsonResponse(
            {"status": "success", "data": serializer.data},
            status=status.HTTP_200_OK,
        )

    # TODO: move to admin viewset
    def create(self, request):
        if not request.user.is_staff:
            return JsonResponse({"status": "error", "data": {"message": "권한이 없습니다"}}, status=status.HTTP_403_FORBIDDEN)

        serializer = SkillSerializer(data=request.data)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return JsonResponse({"status": "error", "data": {"message": "권한이 없습니다"}}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()

        serializer = SkillSerializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return JsonResponse({"status": "success", "data": serializer.data})

    def soft_destory(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return JsonResponse({"status": "error", "data": {"message": "권한이 없습니다"}}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "존재하지 않는 스킬입니다."}}, status=status.HTTP_404_NOT_FOUND
            )

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, *args, **kwargs):
        return self.soft_destory(*args, **kwargs)


class ProfileSkillViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user skill

        :method: POST
        :endpoint: /user/portfolio/skills/
        """
        for skill_pk in request.data["id"]:
            serializer = ProfileSkillSerializer(
                data={
                    "user": request.user.id,
                    "skill": skill_pk,
                }
            )

            if not serializer.is_valid():
                return JsonResponse({"status": "error", "data": serializer.errors}, status=400)

            serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user skill

        :method: DELETE
        :endpoint: /user/portfolio/skills/{skill_id}/
        """
        ProfileSkill.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["delete"])
    def bulk_delete(self, request):
        """
        Delete user skills

        :method: DELETE
        :endpoint: /user/portfolio/skills/bulk_delete/
        """
        ProfileSkill.objects.filter(pk__in=request.data.get("ids"), user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class ProfileLinkViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user link

        :method: POST
        :endpoint: /user/portfolio/links/
        """
        serializer = ProfileLinkSerializer(
            data={
                **request.data,
                "user": request.user.id,
            }
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=400)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user link

        :method: PATCH
        :endpoint: /user/portfolio/links/{link_id}/
        """
        link = ProfileLink.objects.get(pk=pk, user=request.user)

        serializer = ProfileLinkSerializer(link, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=400)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user link

        :method: DELETE
        :endpoint: /user/portfolio/links/{link_id}/
        """
        ProfileLink.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class ExperienceViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user experience

        :method: POST
        :endpoint: /user/portfolio/experiences/
        """
        serializer = ExperienceSerializer(
            data={
                **request.data,
                "user": request.user.id,
            },
            context={"request": request},
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user experience

        :method: PATCH
        :endpoint: /user/portfolio/experiences/{experience_id}/
        """
        experience = Experience.objects.get(pk=pk, user=request.user)

        serializer = ExperienceSerializer(experience, data=request.data, partial=True, context={"request": request})

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user experience

        :method: DELETE
        :endpoint: /user/portfolio/experiences/{experience_id}/
        """
        Experience.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class PresentationViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user presentation

        :method: POST
        :endpoint: /user/portfolio/presentations/
        """
        serializer = PresentationSerializer(
            data={
                **request.data,
                "user": request.user.id,
            }
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user presentation

        :method: PATCH
        :endpoint: /user/portfolio/presentations/{presentation_id}/
        """
        presentation = Presentation.objects.get(pk=pk, user=request.user)

        serializer = PresentationSerializer(presentation, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user presentation

        :method: DELETE
        :endpoint: /user/portfolio/presentations/{presentation_id}/
        """
        Presentation.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class EducationViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user education

        :method: POST
        :endpoint: /user/portfolio/educations/
        """
        serializer = EducationSerializer(
            data={
                **request.data,
                "user": request.user.id,
            }
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user education

        :method: PATCH
        :endpoint: /user/portfolio/educations/{education_id}/
        """
        education = Education.objects.get(pk=pk, user=request.user)

        serializer = EducationSerializer(education, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user education

        :method: DELETE
        :endpoint: /user/portfolio/educations/{education_id}/
        """
        Education.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class AwardViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user award

        :method: POST
        :endpoint: /user/portfolio/awards/
        """
        serializer = AwardSerializer(
            data={
                **request.data,
                "user": request.user.id,
            }
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user award

        :method: PATCH
        :endpoint: /user/portfolio/awards/{award_id}/
        """
        award = Award.objects.get(pk=pk, user=request.user)

        serializer = AwardSerializer(award, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user award

        :method: DELETE
        :endpoint: /user/portfolio/awards/{award_id}/
        """
        Award.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class ProjectViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user project

        :method: POST
        :endpoint: /user/portfolio/projects/
        """
        serializer = ProjectSerializer(
            data={
                **request.data,
                "user": request.user.id,
            }
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user project

        :method: PATCH
        :endpoint: /user/portfolio/projects/{project_id}/
        """
        project = Project.objects.get(pk=pk, user=request.user)

        serializer = ProjectSerializer(project, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        Project.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class ChallengeViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user challenge

        :method: POST
        :endpoint: /user/portfolio/challenges/
        """
        serializer = ChallengeSerializer(
            data={
                **request.data,
                "user": request.user.id,
            }
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user challenge

        :method: PATCH
        :endpoint: /user/portfolio/challenges/{challenge_id}/
        """
        challenge = Challenge.objects.get(pk=pk, user=request.user)

        serializer = ChallengeSerializer(challenge, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user challenge

        :method: DELETE
        :endpoint: /user/portfolio/challenges/{challenge_id}/
        """
        Challenge.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class BountyViewSet(viewsets.ViewSet):
    def create(self, request):
        """
        Add user bounty

        :method: POST
        :endpoint: /user/portfolio/bounties/
        """
        serializer = BountySerializer(
            data={
                **request.data,
                "user": request.user.id,
            }
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        """
        Update user bounty

        :method: PATCH
        :endpoint: /user/portfolio/bounties/{bounty_id}/
        """
        bounty = Bounty.objects.get(pk=pk, user=request.user)

        serializer = BountySerializer(bounty, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        """
        Delete user bounty

        :method: DELETE
        :endpoint: /user/portfolio/bounties/{bounty_id}/
        """
        Bounty.objects.filter(pk=pk, user=request.user).delete()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)
