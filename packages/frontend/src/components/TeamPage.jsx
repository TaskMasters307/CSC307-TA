import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import '../css/TeamPage.css';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Austin Voong',
      role: 'Developer',
      image: '/api/placeholder/300/300',
      bio: 'Passionate about building innovative solutions and leading teams to success.',
      socials: {
        linkedin: 'https://linkedin.com/in/john',
        github: 'https://github.com/john'
      }
    },
    {
      name: 'Trey Martin',
      role: 'Developer',
      image: '/api/placeholder/300/300',
      bio: 'Full-stack developer with 8 years of experience in building scalable applications.',
      socials: {
        linkedin: 'https://linkedin.com/in/sarah',
        github: 'https://github.com/sarah'
      }
    },
    {
      name: 'Duy Nguyen',
      role: 'Developer',
      image: '/api/placeholder/300/300',
      bio: 'Creating user-centered designs with a focus on accessibility and usability.',
      socials: {
        linkedin: 'https://linkedin.com/in/michael',
        github: 'https://github.com/michael'
      }
    },
    {
      name: 'Arian Houshmand',
      role: 'Developer',
      image: '/api/placeholder/300/300',
      bio: 'Specialized in building robust and scalable backend systems with a focus on performance.',
      socials: {
        linkedin: 'https://linkedin.com/in/emily',
        github: 'https://github.com/emily'
      }
    },
    {
      name: 'Sameer Nadeem',
      role: 'Developer',
      image: '/api/placeholder/300/300',
      bio: 'Passionate about creating intuitive and engaging user experiences through thoughtful design.',
      socials: {
        linkedin: 'https://linkedin.com/in/alex',
        github: 'https://github.com/alex'
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