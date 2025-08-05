export const menus = [
    {
        name: "Home",
        link: "/"
    },
    {
        name: "About",
        link: "/about",
        sub: [
            {
                name: "Team",
                link: "/about/team",
                sub: [
                    { name: "Developers", link: "/about/team/dev" },
                    { name: "Designers", link: "/about/team/design" }
                ]
            },
            { name: "History", link: "/about/history" }
        ]
    },
    {
        name: "Services",
        link: "/services",
        sub: [
            { name: "Consulting", link: "/services/consulting" },
            { name: "Development", link: "/services/dev" }
        ]
    }
]
