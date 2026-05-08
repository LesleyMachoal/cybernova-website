// Chatbot knowledge base with rule-based responses
export const chatbotKnowledge = {
  greetings: {
    keywords: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      'Hello! 👋 Welcome to CyberNova Analytics. How can I help you today?',
      'Hi there! 🛡️ I\'m here to help with any questions about our security services.',
      'Hey! Welcome to CyberNova. What would you like to know?'
    ]
  },
  
  services: {
    keywords: ['services', 'what do you offer', 'what services', 'solutions', 'security', 'protection'],
    response: 'We offer comprehensive cybersecurity solutions including:\n\n🔒 Network Security\n🖥️ Endpoint Protection\n🔐 Identity & Access Management\n👁️ Security Monitoring\n☁️ Cloud Security\n🚨 Incident Response\n📋 Compliance Advisory\n📚 Security Training\n\nWould you like details about any specific service?'
  },

  pricing: {
    keywords: ['price', 'pricing', 'cost', 'how much', 'rates', 'fee', 'payment'],
    response: 'Our pricing varies based on your organization\'s needs:\n\n💼 Standard Services - Fixed pricing\n🎯 Custom Services - Tailored solutions\n\nFor a detailed pricing quote, please contact our sales team or fill out the contact form. We\'d love to discuss your specific requirements!'
  },

  contact: {
    keywords: ['contact', 'call', 'email', 'reach', 'support', 'help', 'speak to'],
    response: 'Great! Here\'s how you can reach us:\n\n📞 Phone: +267 76 123 456\n📧 Email: info@cybernova.com\n🌐 Location: Gaborone, Botswana\n📋 Or use our Contact Form on the website\n\nOur team is available 24/7 for urgent security matters!'
  },

  projects: {
    keywords: ['projects', 'case studies', 'portfolio', 'past work', 'examples', 'clients'],
    response: 'We\'ve successfully completed projects for:\n\n🏢 Fortune 500 Tech Companies\n🏦 Global Financial Services\n🏥 Healthcare Networks\n🔧 SaaS Platforms\n🛍️ Retail Groups\n⚡ Energy Infrastructure\n\nCheck our Projects page for detailed case studies and results!'
  },

  events: {
    keywords: ['events', 'webinar', 'training', 'workshop', 'conference', 'when', 'schedule'],
    response: 'We host regular security events:\n\n📅 Cybersecurity Summit - June 15, 2024\n🎓 Cloud Security Workshop - July 18, 2024\n🚨 Incident Response Drill - August 8, 2024\n👥 Security Leaders Roundtable - September 12, 2024\n\nVisit our Events page to see all upcoming events and register!'
  },

  articles: {
    keywords: ['articles', 'blog', 'news', 'insights', 'learn', 'read', 'information'],
    response: 'Check out our latest articles and insights:\n\n📖 Building an Incident Response Playbook\n📖 Cloud Security Posture Management\n📖 Phishing Awareness That Actually Works\n📖 Zero Trust Security Framework\n📖 Advanced Threat Detection\n\nVisit our Articles section for in-depth security knowledge!'
  },

  feedback: {
    keywords: ['feedback', 'testimonials', 'reviews', 'customers', 'clients say', 'ratings'],
    response: 'Our clients love our services! ⭐\n\nWe maintain a 99%+ customer satisfaction rate with testimonials from industry leaders. Our team has:\n\n✅ Prevented APT attacks\n✅ Reduced incidents by 87%\n✅ Improved compliance to 98%\n✅ Accelerated incident response\n\nSee more reviews on our Feedback page!'
  },

  team: {
    keywords: ['team', 'staff', 'who', 'founders', 'company', 'about us', 'about'],
    response: 'CyberNova Analytics is led by industry veterans with 20+ years of combined experience in cybersecurity.\n\n🛡️ Enterprise-grade cyber defence\n🔍 Threat intelligence\n📋 Security advisory\n\nWe\'re headquartered in Gaborone, Botswana, serving global clients. Learn more on our About page!'
  },

  technology: {
    keywords: ['technology', 'tools', 'platform', 'ai', 'machine learning', 'automation'],
    response: 'Our platform leverages cutting-edge technology:\n\n🤖 AI-powered threat detection\n⚡ Automated response systems\n📊 Real-time analytics\n☁️ Cloud-native architecture\n🔐 Zero-trust security model\n\nWe continuously update our defenses against emerging threats!'
  },

  capabilities: {
    keywords: ['capabilities', 'can you', 'do you', 'uptime', 'threats', 'detection', 'response'],
    response: 'Our capabilities include:\n\n✅ 99.9% Uptime guarantee\n✅ 24/7 Monitoring\n✅ 500+ Threats detected daily\n✅ <2ms Response time\n✅ Multi-region protection\n✅ Real-time threat intelligence\n\nWe\'re ready to protect your infrastructure 24/7!'
  },

  industries: {
    keywords: ['industries', 'sectors', 'vertical', 'finance', 'healthcare', 'retail', 'government'],
    response: 'We serve multiple industries:\n\n🏦 Finance & Banking\n🏥 Healthcare\n🛍️ Retail & E-commerce\n⚡ Energy\n🔧 Manufacturing\n🚀 Technology\n📊 Government\n🚚 Logistics\n\nEach with industry-specific security solutions. Let us know your sector!'
  },

  comparison: {
    keywords: ['vs', 'versus', 'competitor', 'compare', 'better', 'differ', 'advantage'],
    response: 'CyberNova stands out because:\n\n🎯 Specialized in your needs\n⚡ Faster response times\n📈 Proven track record\n💼 Dedicated support\n🔄 Continuous innovation\n💰 Transparent pricing\n\nLet\'s discuss how we can outperform the competition for you!'
  },

  thanks: {
    keywords: ['thank', 'thanks', 'thank you', 'appreciate', 'great', 'awesome'],
    responses: [
      'You\'re welcome! Happy to help. 😊 Is there anything else?',
      'My pleasure! Let me know if you need anything else.',
      'Glad I could help! Feel free to ask more questions.'
    ]
  },

  sorry: {
    keywords: ['sorry', 'apologize', 'issue', 'problem', 'error', 'bug', 'broken'],
    response: 'I apologize for any inconvenience. Please provide more details about the issue, and I\'ll help you resolve it. Or contact our support team directly for immediate assistance!'
  }
};

// Function to find best matching response
export function findResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();
  
  for (const category in chatbotKnowledge) {
    const data = chatbotKnowledge[category];
    const keywords = data.keywords || [];
    
    // Check if any keyword matches
    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        if (Array.isArray(data.responses)) {
          // Return random response from array
          return data.responses[Math.floor(Math.random() * data.responses.length)];
        } else {
          // Return single response
          return data.response;
        }
      }
    }
  }
  
  // Default response if no match found
  return 'I\'m not sure about that. Could you rephrase your question? Or use the Contact Form to speak with our team directly. 😊';
}
