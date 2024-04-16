import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const portfolioQueryKey = createQueryKeys("portfolio", {
  getPortfolio: (portfolioId: string) => ["portfolio"],
  getProfile: (portfolioId: string) => ["profile", portfolioId],
  getLinks: (portfolioId: string) => ["link", portfolioId],
  getLink: (portfolioId: string, linkId: string) => ["link", portfolioId, linkId],
  getSkillList: () => ["skill"],
  getSkillRecommandList: () => ["skill", "recommand"],
  getSkills: (portfolioId: string) => ["skill", portfolioId],
  getEducations: (portfolioId: string) => ["education", portfolioId],
  getEducation: (portfolioId: string, educationId: string) => ["education", portfolioId, educationId],
  getPresentations: (portfolioId: string) => ["presentation", portfolioId],
  getPresentation: (portfolioId: string, presentationId: string) => ["presentation", portfolioId, presentationId],
  getAwards: (portfolioId: string) => ["award", portfolioId],
  getAward: (portfolioId: string, awardId: string) => ["award", portfolioId, awardId],
  getReports: (portfolioId: string) => ["report", portfolioId],
  getReport: (portfolioId: string, reportId: string) => ["report", portfolioId, reportId],
  getProjects: (portfolioId: string) => ["project", portfolioId],
  getProject: (portfolioId: string, projectId: string) => ["project", portfolioId, projectId],
  getChallenges: (portfolioId: string) => ["challenge", portfolioId],
  getChallenge: (portfolioId: string, challengeId: string) => ["challenge", portfolioId, challengeId],
  getWorks: (portfolioId: string) => ["work", portfolioId],
  getWork: (portfolioId: string, workId: string) => ["work", portfolioId, workId],
  getTeams: (portfolioId: string) => ["work", portfolioId],
  getTeam: (portfolioId: string, teamId: string) => ["work", portfolioId, teamId],
  getPosts: (portfolioId: string) => ["post", portfolioId],
  getAwnsers: (portfolioId: string) => ["answer", portfolioId],
  getHeatmap: (portfolioId: string) => ["heatmap", portfolioId],
});

const getPortfolio = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/`);

  return data.data;
};

const getProfile = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/profile/`);

  return data.data;
};

const getLinks = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/links/`);
  return data.data;
};

const getLink = async (portfolioId: string, linkId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/links/`);

  const result = data.data.filter((link: any) => link.id == linkId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

const getSkillList = async () => {
  const { data } = await request.get(`/api/portfolio_skills/`);
  return data.data.map((value: any) => {
    return { ...value, skill_id: value.id };
  });
};

// [GET] portfolio/skill/recommand (전체 스킬 종류)
const getSkillRecommandList = async () => {
  const { data } = await request.get(`/api/portfolio_skills/`);
  return data.data.sort((a: any, b: any) => a.using_count - b.using_count);
};

// [GET] portfolio/{portfolioId}/skill
const getSkills = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/skills/`);
  return data.data;
};

const getEducations = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/educations/`);

  return data.data;
};

const getEducation = async (portfolioId: string, educationId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/educations/`);

  const result = data.data.filter((education: any) => education.id == educationId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

// [GET] portfolio/{portfolioId}/presentation
const getPresentations = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/presentations/`);

  return data.data;
};

// [GET] portfolio/{portfolioId}/presentation/{id}
const getPresentation = async (portfolioId: string, presentationId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/presentations/`);

  const result = data.data.filter((presentation: any) => presentation.id == presentationId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

// [GET] portfolio/{portfolioId}/award
const getAwards = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/awards/`);

  return data.data;
};

// [GET] portfolio/{portfolioId}/award/{id}
const getAward = async (portfolioId: string, awardId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/awards/`);

  const result = data.data.filter((award: any) => award.id == awardId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

// [GET] portfolio/{portfolioId}/report
const getReports = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/bounties/`);

  return data.data;
};

// [GET] portfolio/{portfolioId}/report/{id}
const getReport = async (portfolioId: string, reportId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/bounties/`);

  const result = data.data.filter((report: any) => report.id == reportId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

// [GET] portfolio/{portfolioId}/project
const getProjects = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/projects/`);

  return data.data;
};

// [GET] portfolio/{portfolioId}/project/{id}
const getProject = async (portfolioId: string, projectId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/projects/`);

  const result = data.data.filter((project: any) => project.id == projectId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

// [GET] portfolio/{portfolioId}/report
const getChallenges = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/challenges/`);

  return data.data;
};

// [GET] portfolio/{portfolioId}/report/{id}
const getChallenge = async (portfolioId: string, challengeId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/challenges/`);

  const result = data.data.filter((challenge: any) => challenge.id == challengeId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

// [GET] portfolio/{portfolioId}/report
const getWorks = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/experiences/?type=work`);

  return data.data;
};

// [GET] portfolio/{portfolioId}/report/{id}
const getWork = async (portfolioId: string, wordId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/experiences/?type=work`);

  const result = data.data.filter((work: any) => work.id == wordId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

// [GET] portfolio/{portfolioId}/report
const getTeams = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/experiences/?type=team`);

  return data.data;
};

// [GET] portfolio/{portfolioId}/report/{id}
const getTeam = async (portfolioId: string, teamId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/experiences/?type=team`);

  const result = data.data.filter((team: any) => team.id == teamId);

  if (result.length == 0) {
    return null;
  }
  return result[0];
};

const getPosts = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/posts/`);

  return data.data;
};

const getAwnsers = async (portfolioId: string) => {
  const { data } = await request.get(`/api/portfolio/${portfolioId}/answers/`);

  return data.data;
};

const getHeatmap = async (portfolioId: string) => {
  const { data } = await request.get(`/api/profile/${portfolioId}/heatmap/`);

  return data.data;
};

export const usePortfolio = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getPortfolio(portfolioId).queryKey,
    queryFn: () => getPortfolio(portfolioId),
  });
export const useProfile = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getProfile(portfolioId).queryKey,
    queryFn: () => getProfile(portfolioId),
  });

export const useLinks = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getLinks(portfolioId).queryKey,
    queryFn: () => getLinks(portfolioId),
  });

export const useLink = (portfolioId: string, linkId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getLink(portfolioId, linkId).queryKey,
    queryFn: () => getLink(portfolioId, linkId),
  });

export const useSkillList = () =>
  useQuery({
    queryKey: portfolioQueryKey.getSkillList().queryKey,
    queryFn: () => getSkillList(),
  });

export const useSkillRecommandList = () =>
  useQuery({
    queryKey: portfolioQueryKey.getSkillRecommandList().queryKey,
    queryFn: () => getSkillRecommandList(),
  });

export const useSkills = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getSkills(portfolioId).queryKey,
    queryFn: () => getSkills(portfolioId),
  });

export const useEducations = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getEducations(portfolioId).queryKey,
    queryFn: () => getEducations(portfolioId),
  });

export const useEducation = (portfolioId: string, educationId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getEducation(portfolioId, educationId).queryKey,
    queryFn: () => getEducation(portfolioId, educationId),
    ...options,
  });

export const usePresentations = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getPresentations(portfolioId).queryKey,
    queryFn: () => getPresentations(portfolioId),
  });

export const usePresentation = (portfolioId: string, presentationId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getPresentation(portfolioId, presentationId).queryKey,
    queryFn: () => getPresentation(portfolioId, presentationId),
    ...options,
  });

export const useAwards = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getAwards(portfolioId).queryKey,
    queryFn: () => getAwards(portfolioId),
  });

export const useAward = (portfolioId: string, awardId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getAward(portfolioId, awardId).queryKey,
    queryFn: () => getAward(portfolioId, awardId),
    ...options,
  });

export const useReports = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getReports(portfolioId).queryKey,
    queryFn: () => getReports(portfolioId),
  });

export const useReport = (portfolioId: string, reportId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getReport(portfolioId, reportId).queryKey,
    queryFn: () => getReport(portfolioId, reportId),
    ...options,
  });

export const useProjects = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getProjects(portfolioId).queryKey,
    queryFn: () => getProjects(portfolioId),
  });

export const useProject = (portfolioId: string, projectId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getProject(portfolioId, projectId).queryKey,
    queryFn: () => getProject(portfolioId, projectId),
    ...options,
  });

export const useChallenges = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getChallenges(portfolioId).queryKey,
    queryFn: () => getChallenges(portfolioId),
  });

export const useChallenge = (portfolioId: string, challengeId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getChallenge(portfolioId, challengeId).queryKey,
    queryFn: () => getChallenge(portfolioId, challengeId),
    ...options,
  });

export const useWorks = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getWorks(portfolioId).queryKey,
    queryFn: () => getWorks(portfolioId),
  });

export const useWork = (portfolioId: string, workId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getWork(portfolioId, workId).queryKey,
    queryFn: () => getWork(portfolioId, workId),
    ...options,
  });

export const useTeams = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getTeams(portfolioId).queryKey,
    queryFn: () => getTeams(portfolioId),
  });

export const useTeam = (portfolioId: string, teamId: string, options?: {}) =>
  useQuery({
    queryKey: portfolioQueryKey.getTeam(portfolioId, teamId).queryKey,
    queryFn: () => getTeam(portfolioId, teamId),
    ...options,
  });

export const usePosts = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getPosts(portfolioId).queryKey,
    queryFn: () => getPosts(portfolioId),
  });

export const useAnswers = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getAwnsers(portfolioId).queryKey,
    queryFn: () => getAwnsers(portfolioId),
  });

export const useHeatmap = (portfolioId: string) =>
  useQuery({
    queryKey: portfolioQueryKey.getHeatmap(portfolioId).queryKey,
    queryFn: () => getHeatmap(portfolioId),
  });
