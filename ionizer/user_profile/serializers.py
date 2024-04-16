from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    Award,
    Bounty,
    Challenge,
    Education,
    Experience,
    ExperienceSkill,
    Presentation,
    Profile,
    ProfileLink,
    ProfileSkill,
    Project,
    Skill,
)


class ProfileSerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_follower = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "is_owner",
            "image_url",
            "profile_url",
            "level",
            "name",
            "bio",
            "affiliation",
            "post_count",
            "follower_count",
            "following_count",
            "is_follower",
            "is_following",
        ]

    def get_is_owner(self, obj):
        if self.context:
            return obj.user == self.context.get("request").user
        else:
            return None

    def get_post_count(self, obj):
        return obj.user.post_set.count()

    def get_follower_count(self, obj):
        return 0

    def get_following_count(self, obj):
        return 0

    def get_is_follower(self, obj):
        return False

    def get_is_following(self, obj):
        return False


class PortfolioSerializer(ProfileSerializer):
    skills = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()
    experiences = serializers.SerializerMethodField()
    presentations = serializers.SerializerMethodField()
    educations = serializers.SerializerMethodField()
    awards = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    challenges = serializers.SerializerMethodField()
    bounties = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ProfileSerializer.Meta.fields + [
            "skills",
            "links",
            "experiences",
            "presentations",
            "educations",
            "awards",
            "projects",
            "challenges",
            "bounties",
        ]

    def get_skills(self, obj):
        return [
            {
                **SkillSerializer(profile_skill.skill).data,
                "skill_id": profile_skill.id,
            }
            for profile_skill in obj.user.profileskill_set.all()
        ]

    def get_links(self, obj):
        return ProfileLinkSerializer(obj.user.profilelink_set.all(), many=True).data

    def get_experiences(self, obj):
        return ExperienceSerializer(obj.user.experience_set.all(), many=True).data

    def get_presentations(self, obj):
        return PresentationSerializer(obj.user.presentation_set.all(), many=True).data

    def get_educations(self, obj):
        return EducationSerializer(obj.user.education_set.all(), many=True).data

    def get_awards(self, obj):
        return AwardSerializer(obj.user.award_set.all(), many=True).data

    def get_projects(self, obj):
        return ProjectSerializer(obj.user.project_set.all(), many=True).data

    def get_challenges(self, obj):
        return ChallengeSerializer(obj.user.challenge_set.all(), many=True).data

    def get_bounties(self, obj):
        return BountySerializer(obj.user.bounty_set.all(), many=True).data


class SkillSerializer(serializers.ModelSerializer):
    using_count = serializers.SerializerMethodField()

    class Meta:
        model = Skill
        fields = [
            "id",
            "name",
            "using_count",
        ]

    def get_using_count(self, obj):
        return obj.profileskill_set.count()


class ProfileSkillSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all())

    class Meta:
        model = ProfileSkill
        fields = [
            "id",
            "user",
            "skill",
        ]


class ProfileLinkSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    name = serializers.CharField(max_length=32)
    url = serializers.CharField(max_length=255)

    class Meta:
        model = ProfileLink
        fields = [
            "id",
            "user",
            "name",
            "url",
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    company = serializers.CharField(max_length=32)
    position = serializers.CharField(max_length=32)
    description = serializers.CharField(allow_null=True)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    is_current = serializers.BooleanField()
    links = serializers.JSONField(allow_null=True)
    skills = serializers.SerializerMethodField()
    is_hidden = serializers.BooleanField()
    type = serializers.CharField(max_length=8)

    class Meta:
        model = Experience
        fields = [
            "id",
            "user",
            "company",
            "position",
            "description",
            "start_date",
            "end_date",
            "is_current",
            "links",
            "skills",
            "is_hidden",
            "type",
        ]

    def get_skills(self, obj):
        return [
            {
                **SkillSerializer(experience_skill.skill).data,
                "skill_id": experience_skill.id,
            }
            for experience_skill in obj.experienceskill_set.all()
        ]

    def create(self, validated_data):
        experience = Experience.objects.create(**validated_data)

        skill_ids = self.context.get("request").data.get("skills", [])
        for skill_id in skill_ids:
            ExperienceSkill.objects.create(
                user=experience.user,
                experience=experience,
                skill=Skill.objects.get(pk=skill_id),
            )

        return experience

    def update(self, instance, validated_data):
        instance.company = validated_data.get("company", instance.company)
        instance.position = validated_data.get("position", instance.position)
        instance.description = validated_data.get("description", instance.description)
        instance.start_date = validated_data.get("start_date", instance.start_date)
        instance.end_date = validated_data.get("end_date", instance.end_date)
        instance.is_current = validated_data.get("is_current", instance.is_current)
        instance.links = validated_data.get("links", instance.links)
        instance.is_hidden = validated_data.get("is_hidden", instance.is_hidden)

        instance.save()

        skill_ids = self.context.get("request").data.get("skills")
        if skill_ids is not None:
            instance.experienceskill_set.all().delete()
            for skill_id in skill_ids:
                ExperienceSkill.objects.create(
                    user=instance.user,
                    experience=instance,
                    skill=Skill.objects.get(pk=skill_id),
                )

        return instance


class ExperienceSkillSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    experience = serializers.PrimaryKeyRelatedField(queryset=Experience.objects.all())
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all())

    class Meta:
        model = ExperienceSkill
        fields = [
            "id",
            "user",
            "experience",
            "skill",
        ]


class PresentationSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    title = serializers.CharField(max_length=32)
    agency = serializers.CharField(max_length=32)
    event = serializers.CharField(max_length=32)
    location = serializers.CharField(max_length=32)
    date = serializers.DateField()
    description = serializers.CharField(allow_null=True)
    links = serializers.JSONField(allow_null=True)
    is_hidden = serializers.BooleanField()

    class Meta:
        model = Presentation
        fields = [
            "id",
            "user",
            "title",
            "agency",
            "event",
            "location",
            "date",
            "description",
            "links",
            "is_hidden",
        ]


class EducationSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    agency = serializers.CharField(max_length=32)
    major = serializers.CharField(max_length=32)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    is_current = serializers.BooleanField()
    description = serializers.CharField(allow_null=True)
    links = serializers.JSONField(allow_null=True)
    is_hidden = serializers.BooleanField()

    class Meta:
        model = Education
        fields = [
            "id",
            "user",
            "agency",
            "major",
            "start_date",
            "end_date",
            "is_current",
            "description",
            "links",
            "is_hidden",
        ]


class AwardSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    agency = serializers.CharField(max_length=32)
    event = serializers.CharField(max_length=32)
    title = serializers.CharField(max_length=32)
    medal = serializers.CharField(max_length=32, allow_null=True)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    position = serializers.CharField(max_length=32, allow_null=True)
    is_team = serializers.BooleanField()
    description = serializers.CharField(allow_null=True)
    links = serializers.JSONField(allow_null=True)
    is_hidden = serializers.BooleanField()

    class Meta:
        model = Award
        fields = [
            "id",
            "user",
            "agency",
            "event",
            "title",
            "medal",
            "start_date",
            "end_date",
            "position",
            "is_team",
            "description",
            "links",
            "is_hidden",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    title = serializers.CharField(max_length=32)
    achievement = serializers.CharField(max_length=32)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    position = serializers.CharField(max_length=32, allow_null=True)
    is_team = serializers.BooleanField()
    description = serializers.CharField(allow_null=True)
    contribution = serializers.CharField(allow_null=True)
    links = serializers.JSONField(allow_null=True)
    is_hidden = serializers.BooleanField()

    class Meta:
        model = Project
        fields = [
            "id",
            "user",
            "title",
            "achievement",
            "start_date",
            "end_date",
            "position",
            "is_team",
            "description",
            "contribution",
            "links",
            "is_hidden",
        ]


class ChallengeSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    title = serializers.CharField(max_length=32)
    type = serializers.CharField(max_length=32)
    event = serializers.CharField(max_length=32)
    difficulty = serializers.CharField(max_length=32, allow_null=True)
    keyword = serializers.CharField(max_length=32, allow_null=True)
    description = serializers.CharField(allow_null=True)
    links = serializers.JSONField(allow_null=True)
    is_hidden = serializers.BooleanField()

    class Meta:
        model = Challenge
        fields = [
            "id",
            "user",
            "title",
            "type",
            "event",
            "difficulty",
            "keyword",
            "description",
            "links",
            "is_hidden",
        ]


class BountySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    agency = serializers.CharField(max_length=16)
    vendor = serializers.CharField(max_length=16)
    issue_id = serializers.CharField(max_length=16)
    score = serializers.CharField(max_length=16)
    short_description = serializers.CharField(max_length=255)
    date = serializers.DateField()
    description = serializers.CharField(allow_null=True)
    links = serializers.JSONField(allow_null=True)
    is_hidden = serializers.BooleanField()

    class Meta:
        model = Bounty
        fields = [
            "id",
            "user",
            "agency",
            "vendor",
            "issue_id",
            "score",
            "short_description",
            "date",
            "description",
            "links",
            "is_hidden",
        ]
