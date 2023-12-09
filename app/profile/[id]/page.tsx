// app/profile/[id]/page.tsx
import { UserProfile as UserProfileType, ProjectInterface } from "@/common.types";
import ProfilePage from "@/components/ProfilePage";
import { getUser, getUserProjects } from "@/lib/actions";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  const user = await getUser(params.id);
  if (!user) {
    return <p className="no-result-text">Failed to fetch user info</p>;
  }

  const projectsData = await getUserProjects(params.id);

  // Map each project to ProjectInterface
  const projects = projectsData.map(() => ({
    title: '',
    description: '',
    image: '',
    liveSiteUrl: '',
    githubUrl: '',
    category: '',
    id: '',
    createdBy: '',
  })) as ProjectInterface[];
  
  const userProfile: UserProfileType = {
    ...user,
    projects,
    id: "",
    name: "",
    description: null,
    avatarUrl: "",
    githubUrl: null,
    linkedInUrl: null
  };

  return <ProfilePage user={userProfile} />;
};

export default UserProfile;
