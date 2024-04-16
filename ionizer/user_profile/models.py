from django.contrib.auth import get_user_model
from django.db import models

from tsid_pk.fields import TSIDField


class Profile(models.Model):
    user = models.OneToOneField(to=get_user_model(), on_delete=models.CASCADE, primary_key=True)
    image_url = models.CharField(max_length=255, null=True)
    profile_url = models.CharField(max_length=40, null=True)
    level = models.CharField(max_length=16, default="novice")
    name = models.CharField(max_length=40, null=True)
    bio = models.TextField(null=True)
    affiliation = models.CharField(max_length=40, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Skill(models.Model):
    id = TSIDField(primary_key=True)
    name = models.CharField(max_length=32, unique=True)
    deleted_at = models.DateTimeField(null=True, default=None)


class ProfileSkill(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    skill = models.ForeignKey(to=Skill, on_delete=models.CASCADE)


class ProfileLink(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    name = models.CharField(max_length=32)
    url = models.CharField(max_length=255)


class Experience(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    company = models.CharField(max_length=32)  # 회사명
    position = models.CharField(max_length=32)  # 직책
    description = models.TextField(null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True)
    is_current = models.BooleanField(default=False)
    links = models.JSONField(null=True)
    is_hidden = models.BooleanField(default=False)
    type = models.CharField(max_length=8)  # team, work

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class ExperienceSkill(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    experience = models.ForeignKey(to=Experience, on_delete=models.CASCADE)
    skill = models.ForeignKey(to=Skill, on_delete=models.CASCADE)


class Presentation(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=255)  # 발표 주제
    agency = models.CharField(max_length=32)  # 주관사
    event = models.CharField(max_length=32)  # 행사명
    location = models.CharField(max_length=32)  # 장소
    date = models.DateField()  # 발표일
    description = models.TextField(null=True)
    links = models.JSONField(null=True)
    is_hidden = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Education(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    agency = models.CharField(max_length=32)  # 주관사
    major = models.CharField(max_length=32)  # 전공/과정
    start_date = models.DateField()
    end_date = models.DateField(null=True)
    is_current = models.BooleanField(default=False)  # 현재 재학중
    description = models.TextField(null=True)
    links = models.JSONField(null=True)
    is_hidden = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Award(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    agency = models.CharField(max_length=32)  # 주관사
    event = models.CharField(max_length=32)  # 대회명
    title = models.CharField(max_length=32)  # 수상명
    medal = models.CharField(max_length=32, null=True)  # 훈격
    start_date = models.DateField()  # 시작일
    end_date = models.DateField()  # 종료일
    position = models.CharField(max_length=32, null=True)  # 역할
    is_team = models.BooleanField()  # 개인/팀
    description = models.TextField(null=True)  # 설명
    links = models.JSONField(null=True)  # 관련 링크
    is_hidden = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Project(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=32)  # 프로젝트명
    achievement = models.CharField(max_length=32)  # 성과
    start_date = models.DateField()  # 시작일
    end_date = models.DateField()  # 종료일
    position = models.CharField(max_length=32, null=True)  # 팀 구성
    is_team = models.BooleanField()  # 개인/팀
    description = models.TextField(null=True)  # 설명
    contribution = models.TextField(null=True)  # 기여 내용
    links = models.JSONField(null=True)  # 관련 링크
    is_hidden = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Challenge(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=32)  # 문제명
    type = models.CharField(max_length=32)  # 유형
    event = models.CharField(max_length=32)  # 대회명
    difficulty = models.CharField(max_length=32, null=True)  # 난이도
    keyword = models.CharField(max_length=32, null=True)  # 키워드
    description = models.TextField(null=True)  # 설명
    links = models.JSONField(null=True)  # 관련 링크
    is_hidden = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Bounty(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    agency = models.CharField(max_length=16)  # 발급 기관
    vendor = models.CharField(max_length=16, null=True)
    issue_id = models.CharField(max_length=16, null=True)  # CVE/KVE 발급번호
    score = models.CharField(max_length=32, null=True)  # 점수
    short_description = models.CharField(max_length=255)  # 간단한 설명
    date = models.DateField()  # 발급일
    description = models.TextField(null=True)  # 설명
    links = models.JSONField(null=True)  # 관련 링크
    is_hidden = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
