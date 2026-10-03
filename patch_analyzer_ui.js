const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'achievement-analyzer.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Update startAnalysis to use new backend response structure
const oldStartAnalysisStart = 'if (result.topRecommendations && result.topRecommendations.length > 0) {';
const oldStartAnalysisEnd = 'DT_STATE.profile.analysis = localAnalysis;';

const newStartAnalysis = `
                    // MERGE NEW AI ENGINE RESULT WITH LOCAL ANALYSIS
                    if (result.primaryCareer) {
                        localAnalysis.topRole = result.primaryCareer.name;
                        localAnalysis.domain = result.primaryCareer.domain.toLowerCase();
                        localAnalysis.careerMatch = result.primaryCareer.matchPercentage || 50;
                        localAnalysis.requiredSkills = result.primaryCareer.missingSkills || [];
                    }
                    
                    // Attach backend results for new UI components
                    localAnalysis.backendEngine = result;
                    DT_STATE.profile.analysis = localAnalysis;
`;
html = html.replace(/if \(result\.topRecommendations[\s\S]*?DT_STATE\.profile\.analysis = localAnalysis;/, newStartAnalysis.trim());

// 2. Update renderDashboard to render new UI
const oldRenderDashboardStart = '/* SaaS Metrics from Backend */';
const oldRenderDashboardEnd = '/* XP / level */';

const newRenderDashboard = `/* SaaS Metrics from Backend */
            var be = a.backendEngine;
            if (be && be.primaryCareer) {
                var topRec = be.primaryCareer;
                setById('stat-salary', topRec.salaryBand || 'Data currently unavailable');
                setById('stat-growth', topRec.confidenceLevel ? topRec.confidenceLevel + ' Confidence' : 'Data currently unavailable');
                
                var techContainer = document.getElementById('tech-stack-needed');
                if (techContainer && topRec.importantRequirements) {
                    techContainer.innerHTML = topRec.importantRequirements.map(function(t) {
                        return '<span class="skill-chip sc-blue">' + t + '</span>';
                    }).join('');
                }
                
                var certsContainer = document.getElementById('certs-needed');
                if (certsContainer && topRec.missingSkills) {
                    certsContainer.innerHTML = topRec.missingSkills.map(function(c) {
                        return '<div style="margin-bottom:4px">🎯 ' + c + '</div>';
                    }).join('');
                }
            }
            
            // Render new AI Features
            renderExplainableCareerMatch();
            renderGoalAnalysis();
            renderAlternativeCareers();
            renderActionPlan();
            renderConfidenceIndicator();
            renderCompatibilityMatrix();

            /* XP / level */`;

html = html.replace(/\/\* SaaS Metrics from Backend \*\/[\s\S]*?\/\* XP \/ level \*\//, newRenderDashboard);

// 3. Inject new rendering functions at the end of the script
const newFunctions = `
        function renderExplainableCareerMatch() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.primaryCareer) return;
            var container = document.getElementById('ai-explainable-match');
            if (!container) return;
            
            var pc = be.primaryCareer;
            container.innerHTML = '<div style="padding: 1rem; border: 1px solid var(--bdr); border-radius: 8px; background: rgba(255,255,255,0.02); margin-top: 1rem;">' +
                '<h4 style="margin:0 0 0.5rem 0; color: var(--orange); font-size: 1.1rem;">Why this matches: ' + pc.name + ' (' + pc.matchPercentage + '%)</h4>' +
                '<ul style="margin-bottom: 0.5rem; padding-left: 1.2rem; font-size: 0.9rem; color: #cbd5e1;">' + 
                (pc.whyItMatches || []).map(r => '<li>' + r + '</li>').join('') + 
                '</ul>' +
                '<div style="font-size: 0.9rem; color: #94a3b8;"><strong>Existing Skills:</strong> ' + (pc.relevantExistingSkills || []).join(', ') + '</div>' +
                '<div style="font-size: 0.9rem; color: var(--pink);"><strong>Missing Skills:</strong> ' + (pc.missingSkills || []).join(', ') + '</div>' +
            '</div>';
        }

        function renderGoalAnalysis() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.goalAnalysis) return;
            var container = document.getElementById('ai-goal-analysis');
            if (!container) return;
            
            var ga = be.goalAnalysis;
            container.innerHTML = '<div style="padding: 1rem; border: 1px solid ' + (ga.isConflict ? 'var(--red)' : 'var(--bdr)') + '; border-radius: 8px; background: rgba(255,255,255,0.02); margin-top: 1rem;">' +
                '<h4 style="margin:0 0 0.5rem 0; color: ' + (ga.isConflict ? 'var(--red)' : 'var(--blue)') + '; font-size: 1.1rem;">Goal Analysis: ' + ga.statedGoal + '</h4>' +
                '<div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.5rem;">' + ga.explanation + '</div>' +
                '<div style="font-size: 0.9rem; color: #94a3b8;"><strong>Education Gaps:</strong> ' + (ga.educationGaps || []).join(', ') + '</div>' +
                '<div style="font-size: 0.9rem; color: var(--orange);"><strong>Next Steps:</strong> ' + (ga.recommendedNextSteps || []).join(', ') + '</div>' +
            '</div>';
        }

        function renderAlternativeCareers() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.alternativeCareers) return;
            var container = document.getElementById('ai-alternative-careers');
            if (!container) return;
            
            if (be.alternativeCareers.length === 0) {
                container.innerHTML = '<div style="font-size:0.9rem; color:var(--mu);">No alternative careers matched.</div>';
                return;
            }

            container.innerHTML = be.alternativeCareers.map(ac => 
                '<div style="padding: 0.8rem; border-left: 3px solid var(--blue); background: rgba(255,255,255,0.03); margin-top: 0.5rem;">' +
                '<strong style="color: #e2e8f0;">' + ac.name + '</strong> <span style="font-size: 0.8rem; color: var(--mu);">(' + ac.type + ' - ' + ac.matchPercentage + '%)</span>' +
                '<div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.3rem;">' + ac.reasonForRecommendation + '</div>' +
                '</div>'
            ).join('');
        }

        function renderActionPlan() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.actionPlan90Days) return;
            var container = document.getElementById('ai-action-plan');
            if (!container) return;
            
            var ap = be.actionPlan90Days;
            var buildPlan = function(title, data) {
                if (!data) return '';
                return '<div style="margin-bottom: 0.8rem;">' +
                    '<div style="font-weight: 600; color: var(--orange);">' + title + ': ' + data.focus + '</div>' +
                    '<ul style="margin: 0.2rem 0 0 0; padding-left: 1.2rem; font-size: 0.85rem; color: #cbd5e1;">' +
                    (data.tasks || []).map(t => '<li>' + t + '</li>').join('') +
                    '</ul></div>';
            };

            container.innerHTML = '<div style="padding: 1rem; border: 1px solid var(--bdr); border-radius: 8px; background: rgba(255,255,255,0.02); margin-top: 1rem;">' +
                '<h4 style="margin:0 0 0.8rem 0; color: #fff; font-size: 1.1rem;">Personalized 90-Day Action Plan</h4>' +
                buildPlan('Days 1-30', ap.days1to30) +
                buildPlan('Days 31-60', ap.days31to60) +
                buildPlan('Days 61-90', ap.days61to90) +
            '</div>';
        }

        function renderConfidenceIndicator() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.confidence || !be.dataQuality) return;
            var container = document.getElementById('ai-confidence');
            if (!container) return;
            
            container.innerHTML = '<div style="display: flex; gap: 1rem; font-size: 0.85rem; padding: 0.8rem; border-radius: 8px; background: rgba(255,255,255,0.05); margin-top: 1rem;">' +
                '<div><strong style="color:var(--mu)">Data Quality:</strong> <span style="color:var(--wh)">' + be.dataQuality.quality + '</span></div>' +
                '<div><strong style="color:var(--mu)">AI Confidence:</strong> <span style="color:var(--orange)">' + be.confidence.level + '</span></div>' +
                '<div style="flex:1; color:#94a3b8; text-align:right;">' + be.confidence.reason + '</div>' +
            '</div>';
        }

        function renderCompatibilityMatrix() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.careerCompatibility) return;
            var container = document.getElementById('ai-compatibility-matrix');
            if (!container) return;
            
            if (be.careerCompatibility.length === 0) {
                container.innerHTML = '';
                return;
            }

            var rows = be.careerCompatibility.map(c => 
                '<tr>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: #e2e8f0;">' + c.careerName + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: ' + (c.goalFit === 'High' ? 'var(--blue)' : 'var(--mu)') + ';">' + c.goalFit + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr);">' + c.skillFit + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr);">' + c.interestFit + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr);">' + c.overallCompatibility + '</td>' +
                '</tr>'
            ).join('');

            container.innerHTML = '<div style="margin-top: 1.5rem; overflow-x: auto;">' +
                '<h4 style="margin:0 0 0.5rem 0; color: #fff; font-size: 1.1rem;">Career Compatibility Matrix</h4>' +
                '<table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.85rem;">' +
                '<thead><tr>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Career</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Goal Fit</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Skill Fit</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Interest Fit</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Overall</th>' +
                '</tr></thead>' +
                '<tbody>' + rows + '</tbody>' +
                '</table></div>';
        }
        /* ── END OF AI FEATURES ── */
</script>
</body>`;

html = html.replace('</script>\n</body>', newFunctions);

// 4. Inject the DOM containers into view-dashboard
const dashboardInjection = `
              <!-- NEW AI FEATURES -->
              <div id="ai-confidence"></div>
              
              <div class="card g1" style="margin-top: 1.5rem;">
                  <div class="card-accent" style="background:linear-gradient(90deg,var(--blue),var(--cyan))"></div>
                  <div class="card-lbl">Goal vs Current Profile</div>
                  <div id="ai-goal-analysis"></div>
              </div>

              <div class="card g1">
                  <div class="card-accent" style="background:linear-gradient(90deg,var(--orange),var(--pink))"></div>
                  <div class="card-lbl">Explainable Career Match</div>
                  <div id="ai-explainable-match"></div>
              </div>

              <div class="card g1">
                  <div class="card-accent" style="background:linear-gradient(90deg,var(--purple),var(--blue))"></div>
                  <div class="card-lbl">Alternative & Emerging Paths</div>
                  <div id="ai-alternative-careers"></div>
              </div>

              <div class="card g1">
                  <div class="card-accent" style="background:linear-gradient(90deg,var(--cyan),var(--purple))"></div>
                  <div id="ai-compatibility-matrix"></div>
              </div>

              <div class="card g1">
                  <div class="card-accent" style="background:linear-gradient(90deg,var(--orange2),var(--amber))"></div>
                  <div id="ai-action-plan"></div>
              </div>

              <!-- ORIGINAL SCENARIOS -->
`;

html = html.replace('<!-- Badges -->', dashboardInjection + '<!-- Badges -->');

// 5. Fix empty AI errors during parsing and missing values
html = html.replace(/var engine = DT_STATE\\.profile\\.analysis\\.backendEngine;[\\s\\S]*?container\\.style\\.display = 'grid';/, 
"var engine = DT_STATE.profile.analysis.backendEngine;\\n" +
"            if (!engine || !engine.scenarios || engine.scenarios.length === 0) {\\n" +
"                container.style.display = 'none';\\n" +
"                return;\\n" +
"            }\\n" +
"\\n" +
"            container.style.display = 'grid';");

fs.writeFileSync(filePath, html);
console.log("HTML Patched");
