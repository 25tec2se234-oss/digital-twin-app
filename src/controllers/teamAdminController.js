const teamModel = require('../models/teamModel');

function escapeHtml(unsafe) {
  return (unsafe || '').toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderTeamAdmin(team) {
  const memberRows = team.map(m => `
    <tr>
      <td>
        ${m.image_url ? `<img src="${escapeHtml(m.image_url)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />` : `<div style="width:40px;height:40px;border-radius:50%;background:#374151;display:flex;align-items:center;justify-content:center;font-weight:bold;">${m.name.substring(0,2).toUpperCase()}</div>`}
      </td>
      <td><strong>${escapeHtml(m.name)}</strong><br/><span style="font-size:12px;color:#9ca3af;">${escapeHtml(m.role)}</span></td>
      <td>${escapeHtml(m.category || '-')}</td>
      <td>
        <span style="padding:3px 8px;border-radius:12px;background:${m.is_active ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'};color:${m.is_active ? '#2ecc71' : '#e74c3c'};">${m.is_active ? 'Active' : 'Hidden'}</span>
      </td>
      <td>
        <span style="padding:3px 8px;border-radius:12px;background:${m.is_featured ? 'rgba(241,196,15,0.2)' : 'rgba(149,165,166,0.2)'};color:${m.is_featured ? '#f1c40f' : '#95a5a6'};">${m.is_featured ? 'Featured' : 'Normal'}</span>
      </td>
      <td>${m.display_order}</td>
      <td>
        <button onclick='editMember(${JSON.stringify(m).replace(/'/g, "&apos;")})' style="background:#3b82f6;color:white;border:none;padding:6px 12px;cursor:pointer;border-radius:6px;font-weight:bold;margin-right:5px;">Edit</button>
        <button onclick="toggleActive('${m.id}', ${!m.is_active})" style="background:${m.is_active ? '#e74c3c' : '#2ecc71'};color:white;border:none;padding:6px 12px;cursor:pointer;border-radius:6px;font-weight:bold;margin-right:5px;">${m.is_active ? 'Hide' : 'Show'}</button>
        <button onclick="deleteMember('${m.id}')" style="background:#ef4444;color:white;border:none;padding:6px 12px;cursor:pointer;border-radius:6px;font-weight:bold;">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Team Management | Digital Twin Verse</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 32px; background: #0b1322; color: #e8f0f8; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 32px; }
      .header h1 { margin: 0; font-size: 32px; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .btn-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; }
      .btn-primary:hover { opacity: 0.9; }
      .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
      .table-container { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
      table { width: 100%; border-collapse: collapse; text-align: left; }
      th, td { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
      th { background: rgba(255,255,255,0.04); font-weight: 600; color: #94a3b8; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
      tr:last-child td { border-bottom: none; }
      tr:hover { background: rgba(255,255,255,0.02); }
      
      /* Modal Styles */
      .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 1000; align-items: center; justify-content: center; }
      .modal { background: #1e293b; width: 100%; max-width: 500px; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; overflow-y: auto; }
      .modal h2 { margin-top: 0; margin-bottom: 20px; font-size: 20px; }
      .form-group { margin-bottom: 16px; }
      .form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: #94a3b8; font-weight: 600; }
      .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; box-sizing: border-box; font-family: inherit; }
      .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
      
      .image-preview { width: 100px; height: 100px; border-radius: 12px; background: rgba(0,0,0,0.2); margin-top: 10px; border: 1px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
      .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>Team Management</h1>
        <p style="color: #a78bfa; margin-top:5px; font-weight:600; font-size: 14px;">Manage the Digital Twin Verse Team Ecosystem</p>
      </div>
      <div>
        <button onclick="goTo('/dashboard')" style="background:transparent; color: #94a3b8; border: none; cursor: pointer; margin-right: 20px; font-weight: 600; padding:0; font-size:14px;">← Back to Main Dashboard</button>
        <button class="btn-primary" onclick="openAddModal()">+ Add Member</button>
      </div>
    </div>
    
    <script>
      function goTo(url) {
        var userStr = localStorage.getItem('dt_user') || sessionStorage.getItem('dt_appdata_v3');
        var token = '';
        if (userStr) {
          try {
            var data = JSON.parse(userStr);
            if (data.token) token = data.token;
            else if (data.userData && data.userData.token) token = data.userData.token;
          } catch(e) {}
        }
        fetch(url, { headers: { 'Authorization': 'Bearer ' + token } })
        .then(function(res) {
          if (!res.ok) {
            alert('Failed to load: ' + res.statusText);
            return null;
          }
          return res.text();
        })
        .then(function(html) {
          if (html) {
            document.open();
            document.write(html);
            document.close();
            window.history.pushState({}, '', url);
          }
        });
      }
    </script>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name & Role</th>
            <th>Category</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${memberRows || '<tr><td colspan="7" style="text-align:center;color:#64748b;padding:30px;">No team members found. Click Add Member to create one.</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" id="memberModal">
      <div class="modal">
        <h2 id="modalTitle">Add Team Member</h2>
        <form id="memberForm" onsubmit="saveMember(event)">
          <input type="hidden" id="memberId" />
          <input type="hidden" id="imageUrl" />
          
          <div class="form-group">
            <label>Photo</label>
            <input type="file" id="photoInput" accept="image/jpeg, image/png, image/webp" onchange="uploadPhoto(event)" />
            <div id="uploadProgress" style="font-size: 12px; color: #38bdf8; margin-top: 5px; display: none;">Uploading...</div>
            <div class="image-preview" id="imagePreviewContainer">
              <span style="font-size: 12px; color: #94a3b8;">No Image</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Name *</label>
            <input type="text" id="name" required placeholder="John Doe" />
          </div>
          
          <div class="form-group">
            <label>Role *</label>
            <input type="text" id="role" required placeholder="Full-Stack Engineer" />
          </div>
          
          <div class="form-group">
            <label>Category</label>
            <input type="text" id="category" placeholder="Engineering, Design, Leadership..." />
          </div>
          
          <div class="form-group">
            <label>Short Bio</label>
            <textarea id="bio" rows="3" placeholder="A brief description about the member..."></textarea>
          </div>

          <div style="display: flex; gap: 16px;">
            <div class="form-group" style="flex:1;">
              <label>Display Order</label>
              <input type="number" id="displayOrder" value="0" />
            </div>
            <div class="form-group" style="flex:1; display:flex; align-items:center; gap: 8px; margin-top: 15px;">
              <input type="checkbox" id="isFeatured" style="width: auto;" />
              <label style="margin-bottom: 0;">Featured</label>
            </div>
          </div>

          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
          
          <div class="form-group">
            <label>LinkedIn URL</label>
            <input type="url" id="linkedinUrl" placeholder="https://linkedin.com/in/..." />
          </div>
          <div class="form-group">
            <label>GitHub URL</label>
            <input type="url" id="githubUrl" placeholder="https://github.com/..." />
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn-primary" id="saveBtn">Save Member</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      function getToken() {
        // Fallback to localStorage if possible, else check window.opener
        let token = localStorage.getItem('token');
        if (!token && window.opener && window.opener.APP_DATA) {
          token = window.opener.APP_DATA.userData.token;
        }
        return token;
      }

      function getAuthHeaders() {
        const token = getToken();
        return {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        };
      }

      function openAddModal() {
        document.getElementById('modalTitle').innerText = 'Add Team Member';
        document.getElementById('memberForm').reset();
        document.getElementById('memberId').value = '';
        document.getElementById('imageUrl').value = '';
        document.getElementById('imagePreviewContainer').innerHTML = '<span style="font-size: 12px; color: #94a3b8;">No Image</span>';
        document.getElementById('memberModal').style.display = 'flex';
      }

      function editMember(m) {
        document.getElementById('modalTitle').innerText = 'Edit Team Member';
        document.getElementById('memberId').value = m.id;
        document.getElementById('name').value = m.name || '';
        document.getElementById('role').value = m.role || '';
        document.getElementById('category').value = m.category || '';
        document.getElementById('bio').value = m.bio || '';
        document.getElementById('displayOrder').value = m.display_order || 0;
        document.getElementById('isFeatured').checked = m.is_featured;
        document.getElementById('imageUrl').value = m.image_url || '';
        
        if (m.social_links) {
          document.getElementById('linkedinUrl').value = m.social_links.linkedin || '';
          document.getElementById('githubUrl').value = m.social_links.github || '';
        } else {
          document.getElementById('linkedinUrl').value = '';
          document.getElementById('githubUrl').value = '';
        }

        if (m.image_url) {
          document.getElementById('imagePreviewContainer').innerHTML = '<img src="' + m.image_url + '" />';
        } else {
          document.getElementById('imagePreviewContainer').innerHTML = '<span style="font-size: 12px; color: #94a3b8;">No Image</span>';
        }

        document.getElementById('memberModal').style.display = 'flex';
      }

      function closeModal() {
        document.getElementById('memberModal').style.display = 'none';
      }

      async function uploadPhoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        const token = getToken();
        if (!token) return alert('Auth token required');

        const formData = new FormData();
        formData.append('file', file);

        const progress = document.getElementById('uploadProgress');
        progress.style.display = 'block';

        try {
          const res = await fetch('/api/v1/files/upload', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + token
            },
            body: formData
          });
          const data = await res.json();
          progress.style.display = 'none';

          if (res.ok) {
            document.getElementById('imageUrl').value = data.file.url;
            document.getElementById('imagePreviewContainer').innerHTML = '<img src="' + data.file.url + '" />';
          } else {
            alert('Upload failed: ' + (data.error || 'Unknown error'));
          }
        } catch (err) {
          progress.style.display = 'none';
          alert('Network error during upload');
        }
      }

      async function saveMember(e) {
        e.preventDefault();
        const id = document.getElementById('memberId').value;
        const btn = document.getElementById('saveBtn');
        btn.innerText = 'Saving...';
        btn.disabled = true;

        const payload = {
          name: document.getElementById('name').value,
          role: document.getElementById('role').value,
          category: document.getElementById('category').value,
          bio: document.getElementById('bio').value,
          imageUrl: document.getElementById('imageUrl').value,
          displayOrder: parseInt(document.getElementById('displayOrder').value) || 0,
          isFeatured: document.getElementById('isFeatured').checked,
          socialLinks: {}
        };

        const li = document.getElementById('linkedinUrl').value;
        if (li) payload.socialLinks.linkedin = li;
        const gh = document.getElementById('githubUrl').value;
        if (gh) payload.socialLinks.github = gh;

        const method = id ? 'PUT' : 'POST';
        const url = '/api/v1/team' + (id ? '/' + id : '');

        try {
          const res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
          });
          
          if (res.ok) {
            window.location.reload();
          } else {
            const err = await res.json();
            alert('Error: ' + (err.error || 'Failed to save'));
            btn.innerText = 'Save Member';
            btn.disabled = false;
          }
        } catch (err) {
          alert('Network Error');
          btn.innerText = 'Save Member';
          btn.disabled = false;
        }
      }

      async function toggleActive(id, isActive) {
        if (!confirm(isActive ? 'Show this member on the public page?' : 'Hide this member from the public page?')) return;
        
        try {
          const res = await fetch('/api/v1/team/' + id + '/status', {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ isActive })
          });
          if (res.ok) {
            window.location.reload();
          } else {
            alert('Failed to update status');
          }
        } catch (err) {
          alert('Network error');
        }
      }

      async function deleteMember(id) {
        if (!confirm('Are you sure you want to completely delete this team member? This action cannot be undone.')) return;
        
        try {
          const res = await fetch('/api/v1/team/' + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          if (res.ok) {
            window.location.reload();
          } else {
            alert('Failed to delete member');
          }
        } catch (err) {
          alert('Network error');
        }
      }
    </script>
  </body>
  </html>
  `;
}

const index = async function(req, res, next) {
  try {
    const team = await teamModel.getAll({ activeOnly: false });
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(renderTeamAdmin(team));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index
};
