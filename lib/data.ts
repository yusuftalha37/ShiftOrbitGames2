export interface TeamMember {
  id: string
  name: string
  role: string
  photo: string
  linkedin?: string
  customLink?: string
  customLinkLabel?: string
}

export const team: TeamMember[] = [
  {
    id: "member-1",
    name: "İsim Soyisim",
    role: "Game Director",
    photo: "/team/member1.jpg",
    linkedin: "https://linkedin.com/in/username",
  },
  {
    id: "member-2",
    name: "İsim Soyisim",
    role: "Lead Developer",
    photo: "/team/member2.jpg",
    linkedin: "https://linkedin.com/in/username",
  },
  {
    id: "member-3",
    name: "İsim Soyisim",
    role: "Game Artist",
    photo: "/team/member3.jpg",
    linkedin: "https://linkedin.com/in/username",
  },
]
