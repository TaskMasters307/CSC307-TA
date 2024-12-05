import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import '../css/TeamPage.css';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Austin Voong',
      role: 'Developer',
      image: '/assets/team/Austin.jpg',
      bio: '"I love coding!"',
      socials: {
        linkedin: 'https://www.linkedin.com/in/austin-voong-6a5573253/',
        github: 'https://github.com/austinvoong'
      }
    },
    {
      name: 'Trey Martin',
      role: 'Developer',
      image: '/assets/team/trey_martin.jpeg',
      bio: '"Managing the database seemed scary at first, but it ended up being my favorite part."',
      socials: {
        linkedin: 'https://www.linkedin.com/in/jam3s-m4rtin/',
        github: 'https://github.com/TreyMartin0'
      }
    },
    {
      name: 'Duy Nguyen',
      role: 'Developer',
      image: '/assets/team/duy.png',
      bio: '"Learned so much about teamwork while building something I actually needed for my own classes."',
      socials: {
        linkedin: 'https://www.linkedin.com/in/dnguyen-proverb2528/',
        github: 'https://github.com/DuyNguyen2528'
      }
    },
    {
      name: 'Arian Houshmand',
      role: 'Developer',
      image: '/assets/team/arianhoush.jpeg',
      bio: '"Making the interface user-friendly was tough but seeing my friends actually use it made it worth it."',
      socials: {
        linkedin: 'https://www.linkedin.com/in/arian-housh/',
        github: 'https://github.com/arian-housh'
      }
    },
    {
      name: 'Sameer Nadeem',
      role: 'Developer',
      image: '/assets/team/sameer.jpg',
      bio: '"The calendar feature started as a simple idea but turned out really useful for all of us."',
      socials: {
        linkedin: 'https://www.linkedin.com/in/sameer--nadeem/',
        github: 'https://github.com/SameerNadeem'
      }
    }
  ];

  return (
    <div className="team-container">
      <div className="team-header">
        <h1 className="team-title">Our Team</h1>
        <p className="team-description">
          MEET THE TEAM
        </p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="team-member">
              <img
                src={member.image}
                alt={member.name}
                className="member-image"
              />
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-bio">{member.bio}</p>
              
              <div className="social-links">
                <a href={member.socials.linkedin} className="social-link" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
                <a href={member.socials.github} className="social-link" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;