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
              20+ Years • 500+ Small Businesses Served
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              I Help Small Businesses 
              <span className="text-blue-700 block">Automate with AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Two decades of solving complex technical challenges. Today, I specialize in AI and prompt engineering 
              that delivers 40-60% task reduction and measurable ROI for small businesses like yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 flex items-center justify-center">
                Get Your Free AI Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                See Client Results
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
              How I Transform Small Businesses with Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three core services that solve your biggest challenges and drive real business results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Primary Service - AI & Prompt Engineering */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg text-sm font-bold">
                MY SPECIALTY
              </div>
              <div className="bg-blue-700 p-3 rounded-lg w-fit mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI & Prompt Engineering</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                I design custom AI solutions that automate your repetitive tasks, enhance customer service, 
                and unlock data insights. My prompt engineering expertise ensures AI works exactly how your business needs it.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Custom AI automation for your processes</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Advanced prompt engineering</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Seamless integration with existing systems</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700">Typical Results:</div>
                <div className="text-gray-900 font-bold">40-60% reduction in manual tasks, 25% faster decisions</div>
              </div>
            </div>

            {/* Network Design */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="bg-emerald-600 p-3 rounded-lg w-fit mb-6">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Network Infrastructure</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                I build secure, scalable networks that support your growth. Security-first approach 
                with performance optimization that keeps your business running smoothly.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Custom network architecture</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Security-first implementation</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Scalable for business growth</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-emerald-700">Guaranteed:</div>
                <div className="text-gray-900 font-bold">99.9% uptime, 50% faster data access</div>
              </div>
            </div>

            {/* Technical Support */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="bg-orange-600 p-3 rounded-lg w-fit mb-6">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Proactive Support</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                I prevent problems before they impact your business. Proactive monitoring, 
                rapid resolution, and strategic planning that keeps you ahead of issues.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>24/7 proactive monitoring</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Rapid issue resolution</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Strategic technology planning</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-orange-700">Performance:</div>
                <div className="text-gray-900 font-bold">90% faster resolution, 70% fewer incidents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2" />
              95% Client Satisfaction • 500+ Businesses Served
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Small Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-xl mb-4">
                <div className="text-4xl font-bold text-blue-700 mb-2">68%</div>
                <div className="text-gray-600">Average cost reduction in operations</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-8 rounded-xl mb-4">
                <div className="text-4xl font-bold text-emerald-700 mb-2">3.2x</div>
                <div className="text-gray-600">Faster data-driven decisions</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-8 rounded-xl mb-4">
                <div className="text-4xl font-bold text-orange-700 mb-2">45%</div>
                <div className="text-gray-600">Faster customer response times</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Small Businesses Choose Me</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Brain className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI-First Expertise</h4>
                    <p className="text-gray-600">I lead the industry in practical AI implementation that actually works for small businesses.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">ROI-Focused Approach</h4>
                    <p className="text-gray-600">Every recommendation is backed by business impact analysis. Your technology investments will drive real results.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">20+ Years of Experience</h4>
                    <p className="text-gray-600">Streamlined processes ensure fast deployment without disrupting your daily operations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What My Clients Say</h3>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4 italic">
                    "The AI solutions have transformed how we handle customer inquiries. What used to take hours now happens in minutes, and our customers are happier than ever."
                  </p>
                  <div className="font-semibold text-gray-900">- Sarah M., Retail Business Owner</div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4 italic">
                    "Twenty years of experience shows in every recommendation. Our network hasn't had a single major issue since the upgrade, and productivity has soared."
                  </p>
                  <div className="font-semibold text-gray-900">- Mike T., Manufacturing Company</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-700 to-indigo-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Automate Your Business with AI?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Get a free 30-minute assessment where I'll analyze your processes and show you exactly 
            how AI can reduce costs and accelerate growth in your specific business.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Free AI Opportunity Assessment Includes:</h3>
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
              Schedule My Free Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Send Me a Message
            </button>
          </div>

          <div className="mt-8 text-blue-200 text-sm">
            ✓ No obligation  •  ✓ Custom recommendations  •  ✓ 20+ years proven expertise
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
                Transforming small businesses through AI-powered solutions and two decades of proven expertise.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI & Prompt Engineering</li>
                <li>Network Infrastructure</li>
                <li>Proactive Support</li>
                <li>Business Automation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Get Started</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Free AI Assessment</li>
                <li>Strategy Sessions</li>
                <li>Custom Solutions</li>
                <li>24/7 Support</li>
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