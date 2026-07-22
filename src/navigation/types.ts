export type RootStackParamList = {
  Home: undefined
  MainTabs: undefined;
  SchoolSubjects: undefined; 
  SchoolClassSelection: { subjectId: string; subjectName: string; emoji: string };
  SubjectHome: { classId: string; className: string; subjectId: string; subjectName: string };
  SubjectSyllabus: { classId: string; subjectId: string; subjectName: string; sectionType: 'school' | 'competitive' };
  ScienceSubjects: { classId: string; className: string };
  ScienceChapters: { classId: string; className: string; branch: 'physics' | 'chemistry' | 'biology'; branchName: string };
  SocialScienceSubjects: { classId: string; className: string };
  SocialScienceChapters: { classId: string; className: string; subjectCode: string; subjectName: string };
  EnglishSubjects: { classId: string; className: string };
  EnglishChapters: { classId: string; className: string; bookCode: string; bookName: string };
  HindiSubjects: { classId: string; className: string };
  HindiChapters: { classId: string; className: string; bookCode: string; bookName: string };
  SanskritSubjects: { classId: string; className: string };
  SanskritChapters: { classId: string; className: string; bookCode: string; bookName: string };
  TopicList: { classId: string; chapterNum: number; chapterTitle: string; subjectId: string; subjectName: string; sectionType: 'school' | 'competitive' };
  TopicDetail: { topicId: string; topicTitle: string };
  CompetitiveSubjects: undefined;
  CompetitiveExams: { categoryId: string; categoryName: string; categoryEmoji: string };
  Subscription: undefined;
  Profile: undefined;
  Payment: { planId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type TabParamList={
  HomeTab: undefined
  SearchTab: undefined
  SettingTab: undefined
};