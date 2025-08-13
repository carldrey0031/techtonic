import React from 'react';
import { Brain, Network, Headphones, ArrowRight, CheckCircle, MessageSquare, Zap, Shield, TrendingUp } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-700" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechConsult Pro</h1>
                <p className="text-sm text-gray-600">AI & Technology Solutions</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Services</a>
              <a href="#experience" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Experience</a>
              <a href="#results" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Results</a>
              <a href="#contact" className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">Get Started</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="h-4 w-4 mr-2" />
              AI & Prompt Engineering Specialist
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Small Business with 
              <span className="text-blue-700 block">AI-Powered Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Leverage 20+ years of technical expertise to implement cutting-edge AI and prompt engineering solutions 
              that drive measurable business outcomes, reduce operational costs, and accelerate growth for your small business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 flex items-center justify-center">
                Schedule AI Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Strategic Technology Services for Small Business Growth
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions designed to solve your most pressing technical challenges 
              while delivering measurable business results and competitive advantages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Primary Service - AI & Prompt Engineering */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg text-sm font-bold">
                PRIMARY FOCUS
              </div>
              <div className="bg-blue-700 p-3 rounded-lg w-fit mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI & Prompt Engineering</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Transform your business operations with custom AI implementations and advanced prompt engineering. 
                Automate repetitive tasks, enhance customer service, and unlock data insights that drive revenue growth 
                and operational efficiency.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Custom AI solution development</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Advanced prompt engineering for business processes</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>AI integration with existing systems</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>ROI-focused AI strategy and implementation</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700">Typical Business Impact:</div>
                <div className="text-gray-900 font-bold">40-60% reduction in manual tasks, 25% faster decision-making</div>
              </div>
            </div>

            {/* Network Design & Implementation */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="bg-emerald-600 p-3 rounded-lg w-fit mb-6">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Network Design & Implementation</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Build robust, scalable network infrastructure that supports your business growth while ensuring 
                security, reliability, and optimal performance. Get the foundation you need for digital transformation.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Custom network architecture design</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Security-first implementation approach</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Scalable solutions for business growth</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Performance optimization and monitoring</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-emerald-700">Business Value:</div>
                <div className="text-gray-900 font-bold">99.9% uptime, 50% faster data access</div>
              </div>
            </div>

            {/* Technical Support */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="bg-orange-600 p-3 rounded-lg w-fit mb-6">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Strategic Technical Support</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Proactive technical support that prevents problems before they impact your business. 
                Get expert guidance, rapid issue resolution, and strategic technology planning.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Proactive monitoring and maintenance</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Rapid issue resolution and support</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Strategic technology planning</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Staff training and knowledge transfer</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-orange-700">Support Impact:</div>
                <div className="text-gray-900 font-bold">90% faster resolution, 70% fewer incidents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4 mr-2" />
                20+ Years Proven Expertise
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Two Decades of Solving Complex Technical Challenges for Small Businesses
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Since the early days of business networking, I've been helping small businesses leverage technology 
                for competitive advantage. Today, I bring that deep experience to the cutting edge of artificial intelligence, 
                combining time-tested technical expertise with revolutionary AI capabilities.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-blue-700 mb-2">500+</div>
                  <div className="text-gray-600">Small businesses served</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">20+</div>
                  <div className="text-gray-600">Years of expertise</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                  <div className="text-gray-600">Client satisfaction rate</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support availability</div>
                </div>
              </div>

              <button className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors flex items-center">
                Discuss Your Technology Challenges
                <MessageSquare className="ml-2 h-5 w-5" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Small Businesses Choose My Expertise</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Brain className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI-First Approach</h4>
                    <p className="text-gray-600">Leading the industry in practical AI implementation, helping businesses automate processes and unlock insights.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">ROI-Focused Solutions</h4>
                    <p className="text-gray-600">Every recommendation is backed by business impact analysis, ensuring technology investments drive real results.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Rapid Implementation</h4>
                    <p className="text-gray-600">Streamlined processes developed over 20 years ensure fast deployment without disrupting daily operations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Measurable Results That Drive Business Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real outcomes from real small businesses that have leveraged our AI and technology consulting expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-xl mb-4">
                <div className="text-4xl font-bold text-blue-700 mb-2">68%</div>
                <div className="text-gray-600">Average cost reduction in operational tasks</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-8 rounded-xl mb-4">
                <div className="text-4xl font-bold text-emerald-700 mb-2">3.2x</div>
                <div className="text-gray-600">Faster data-driven decision making</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-8 rounded-xl mb-4">
                <div className="text-4xl font-bold text-orange-700 mb-2">45%</div>
                <div className="text-gray-600">Improvement in customer response times</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Small Business Owners Say</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-700 mb-4 italic">
                  "The AI solutions implemented have transformed how we handle customer inquiries. What used to take hours now happens in minutes, and our customers are happier than ever."
                </p>
                <div className="font-semibold text-gray-900">- Sarah M., Retail Business Owner</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-700 mb-4 italic">
                  "Twenty years of experience shows in every recommendation. Our network infrastructure hasn't had a single major issue since the upgrade, and productivity has soared."
                </p>
                <div className="font-semibold text-gray-900">- Mike T., Manufacturing Company</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-700 to-indigo-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business with AI?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Schedule a complimentary strategy session to discover how AI and advanced technology solutions 
            can solve your specific business challenges and accelerate growth.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Free 30-Minute AI Opportunity Assessment</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-blue-100">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Process Automation Analysis</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Cost Reduction Opportunities</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Custom Implementation Roadmap</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center">
              Schedule Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Send a Message
            </button>
          </div>

          <div className="mt-8 text-blue-200 text-sm">
            ✓ No obligation consultation  •  ✓ Custom solution recommendations  •  ✓ 20+ years proven expertise
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">TechConsult Pro</h3>
                  <p className="text-gray-400">AI & Technology Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Transforming small businesses through AI-powered solutions and two decades of proven technical expertise.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI & Prompt Engineering</li>
                <li>Network Design</li>
                <li>Technical Support</li>
                <li>Business Automation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Free Consultation</li>
                <li>Strategy Sessions</li>
                <li>Support Services</li>
                <li>Custom Solutions</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TechConsult Pro. Empowering small businesses with AI and technology solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;