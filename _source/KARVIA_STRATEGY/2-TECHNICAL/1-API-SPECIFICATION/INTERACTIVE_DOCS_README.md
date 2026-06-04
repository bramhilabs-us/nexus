# KARVIA Pro API - Interactive Documentation Guide

## 🎯 Overview

This directory now contains a complete interactive HTML documentation system for the KARVIA Pro API, allowing developers and QA teams to explore all 128 endpoints visually, test them easily, and understand the complete API structure.

## 📁 Files Delivered

### 1. **karvia_api_docs_interactive.html** (23 KB)
Complete interactive API documentation with:
- Beautiful, responsive UI inspired by modern design systems
- Search functionality across all endpoints
- Domain-based navigation (14 domains)
- Expandable endpoint cards with full details
- Request/response examples
- Parameter documentation
- Authentication requirements
- cURL examples for each endpoint

### 2. **api_data.json** (116 KB)
Extracted endpoint data from the OpenAPI specification:
- All 128 endpoints with complete metadata
- Organized by domain
- Parameters, request bodies, responses
- Public vs authenticated endpoint markers
- Optimized for fast loading in the HTML interface

### 3. **API_TEST_PLAN.md** (Large)
Comprehensive testing strategy document:
- Test cases for all 128 endpoints
- Security testing checklist
- Performance benchmarks
- Integration test scenarios
- Automated test examples
- CI/CD integration guide

---

## 🚀 Quick Start

### Open the Interactive Documentation

#### Option 1: Direct Browser (Recommended for Local Development)
```bash
# Navigate to the directory
cd KARVIA_STRATEGY/2-TECHNICAL/1-API-SPECIFICATION

# Open in default browser
open karvia_api_docs_interactive.html

# Or on Linux
xdg-open karvia_api_docs_interactive.html

# Or on Windows
start karvia_api_docs_interactive.html
```

#### Option 2: Local Server (Recommended for Testing)
```bash
# Using Python's built-in server
python3 -m http.server 8000

# Then open: http://localhost:8000/karvia_api_docs_interactive.html
```

#### Option 3: Deploy to Web Server
```bash
# Copy files to your web server
scp karvia_api_docs_interactive.html api_data.json user@server:/var/www/html/api-docs/

# Access via: https://yourserver.com/api-docs/karvia_api_docs_interactive.html
```

---

## 💡 How to Use the Interactive Documentation

### 1. Navigation

**Sidebar - Domain List:**
- Click on any domain (Authentication, Companies, Objectives, etc.)
- Shows endpoint count for each domain
- Active domain is highlighted in purple gradient

**Main Content Area:**
- Displays all endpoints for selected domain
- Color-coded HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Public endpoints are marked with a yellow badge

### 2. Search Functionality

```
🔍 Search bar at the top:
```

- Search by endpoint path (e.g., "/api/objectives")
- Search by HTTP method (e.g., "GET")
- Search by description keywords (e.g., "cascade", "analytics")
- Results update in real-time as you type
- Shows total number of matching endpoints

### 3. Endpoint Details

**Click any endpoint card to expand and see:**

- **Description**: What the endpoint does
- **Authentication**: Whether JWT token is required
- **Parameters**: All query, path, and header parameters
  - Parameter name and location (query, path, header)
  - Data type (string, integer, boolean, etc.)
  - Required vs optional (marked with *)
  - Description of each parameter
- **Request Body**: Indication if JSON body is required
- **Response Codes**: All possible HTTP status codes
  - 2xx (Success) - Green
  - 4xx (Client Error) - Orange
  - 5xx (Server Error) - Red
- **cURL Example**: Ready-to-use command-line example

### 4. Visual Features

**Color Coding:**
- **GET**: Green - Read operations
- **POST**: Blue - Create operations
- **PUT**: Orange - Update operations
- **DELETE**: Red - Delete operations
- **PATCH**: Purple - Partial update operations

**Interactive Elements:**
- Hover over any endpoint card for preview
- Click to expand/collapse details
- Smooth animations and transitions
- Responsive design for mobile/tablet/desktop

---

## 📊 Understanding the API Structure

### Domain Overview

The API is organized into 14 functional domains:

1. **Objectives** (14 endpoints) - Core OKR management
2. **Analytics** (14 endpoints) - Business intelligence & reporting
3. **Assessments** (13 endpoints) - SSI assessments & scoring
4. **Tasks** (10 endpoints) - Task management
5. **AI OKR** (10 endpoints) - AI-powered objective generation
6. **Goals** (9 endpoints) - Personal goal setting
7. **Invitations** (9 endpoints) - User invitation system
8. **Companies** (8 endpoints) - Company management
9. **Teams** (9 endpoints) - Team organization
10. **Assessment Templates** (8 endpoints) - Template management
11. **Authentication** (7 endpoints) - User auth & sessions
12. **Utilities** (7 endpoints) - Files, notifications, search
13. **OKR Cascade** (6 endpoints) - Multi-level OKR alignment
14. **Admin** (4 endpoints) - System administration

### HTTP Method Distribution

- **GET** (61 endpoints - 47.7%): Read operations
- **POST** (42 endpoints - 32.8%): Create operations
- **PUT** (12 endpoints - 9.4%): Update operations
- **DELETE** (10 endpoints - 7.8%): Delete operations
- **PATCH** (3 endpoints - 2.3%): Partial updates

### Authentication

**Public Endpoints** (4 total):
- `GET /api/admin/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/invitations/validate/{token}` - Validate invitation
- `POST /api/invitations/accept/{token}` - Accept invitation

**Authenticated Endpoints** (124 total):
- Require `Authorization: Bearer <jwt_token>` header
- Token obtained from `/api/auth/login`
- Token expires after 1 hour

---

## 🧪 Using for Testing

### Manual Testing Workflow

1. **Select a Domain** from the sidebar (e.g., "Authentication")

2. **Review Endpoints** in that domain

3. **Copy cURL Command** from expanded endpoint details

4. **Modify as Needed**:
   ```bash
   # Original cURL
   curl -X POST "https://api.karvia.pro/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"key": "value"}'

   # Modified with actual data
   curl -X POST "https://api.karvia.pro/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!"
     }'
   ```

5. **Execute in Terminal** and observe response

6. **Repeat for All Endpoints** in your test plan

### Integration with Test Plan

The **API_TEST_PLAN.md** references endpoints from the interactive docs:

1. Open interactive docs in one window
2. Open test plan in another
3. Navigate to domain being tested
4. Use cURL examples as starting point
5. Check off test cases as completed

### Creating Postman Collection

**From cURL Examples:**

1. Copy cURL command from interactive docs
2. In Postman: Import → Raw Text → Paste cURL
3. Postman automatically converts to request
4. Repeat for all endpoints
5. Organize into folders by domain
6. Export as collection JSON

---

## 🎨 Customization

### Changing the API Base URL

Edit `karvia_api_docs_interactive.html`:

```javascript
// Find this line in the cURL examples section:
<div class="code-block">curl -X ${endpoint.method} "https://api.karvia.pro${endpoint.path}"

// Change to your environment:
<div class="code-block">curl -X ${endpoint.method} "https://staging.karvia.pro${endpoint.path}"
// or
<div class="code-block">curl -X ${endpoint.method} "http://localhost:3000${endpoint.path}"
```

### Adding More Information

The `api_data.json` file can be regenerated with additional fields:

```bash
# Re-run the extraction script with modifications
python3 extract_api_data.py

# The HTML will automatically use the new data
```

### Styling Changes

All CSS is embedded in the HTML file. Common customizations:

```css
/* Change primary color (currently purple) */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Change to your brand colors */
}

/* Change method badge colors */
.method-GET { background: #10b981; color: white; }
.method-POST { background: #3b82f6; color: white; }
/* etc... */
```

---

## 📱 Responsive Design

The interactive documentation is fully responsive:

- **Desktop** (>1024px): Sidebar + content grid
- **Tablet** (768-1024px): Stacked layout with collapsible sidebar
- **Mobile** (<768px): Full-width cards, optimized touch targets

### Mobile Usage Tips

1. Use search to quickly find endpoints
2. Tap domain names to filter
3. Swipe to scroll through endpoints
4. Tap cards to expand (larger touch targets)

---

## 🔧 Troubleshooting

### Issue: "Failed to load API data"

**Cause**: Browser can't access `api_data.json` due to CORS

**Solution**:
```bash
# Use a local server instead of file://
python3 -m http.server 8000
# Then access via http://localhost:8000/
```

### Issue: Search not working

**Cause**: JavaScript disabled or old browser

**Solution**:
- Enable JavaScript in browser settings
- Use modern browser (Chrome, Firefox, Safari, Edge)

### Issue: Styles not loading

**Cause**: Browser cache

**Solution**:
```bash
# Hard refresh
- Chrome/Firefox: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Safari: Cmd+Option+R
```

### Issue: cURL examples not working

**Cause**: Missing or invalid JWT token

**Solution**:
```bash
# 1. First login to get token
TOKEN=$(curl -X POST "https://api.karvia.pro/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' \
  | jq -r '.data.token')

# 2. Use token in subsequent requests
curl -X GET "https://api.karvia.pro/api/objectives" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Performance Optimization

### For Large Teams

If the JSON file becomes very large (>500 KB):

1. **Split by Domain**:
   ```javascript
   // Load domain data on-demand
   fetch(`api_data_${domain}.json`)
   ```

2. **Use Compression**:
   ```bash
   # Gzip the JSON file
   gzip -k api_data.json
   # Configure server to serve .gz files
   ```

3. **Implement Lazy Loading**:
   ```javascript
   // Load endpoint details only when expanded
   ```

---

## 🚀 Deployment Options

### 1. GitHub Pages

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Copy files
cp karvia_api_docs_interactive.html index.html
cp api_data.json .

# Push to GitHub
git add .
git commit -m "Deploy API docs"
git push origin gh-pages

# Access at: https://yourusername.github.io/yourrepo/
```

### 2. Netlify

```bash
# Create netlify.toml
cat > netlify.toml << EOF
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/karvia_api_docs_interactive.html"
  status = 200
EOF

# Deploy
netlify deploy --prod
```

### 3. AWS S3 + CloudFront

```bash
# Upload to S3
aws s3 cp karvia_api_docs_interactive.html s3://your-bucket/api-docs/ --acl public-read
aws s3 cp api_data.json s3://your-bucket/api-docs/ --acl public-read

# Configure CloudFront for caching
```

### 4. Docker Container

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY karvia_api_docs_interactive.html /usr/share/nginx/html/index.html
COPY api_data.json /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t karvia-api-docs .
docker run -p 8080:80 karvia-api-docs

# Access at: http://localhost:8080
```

---

## 📖 Additional Resources

### Related Documentation

- **openapi.yaml** - Complete OpenAPI 3.0.3 specification
- **README.md** - General API documentation overview
- **API_TEST_PLAN.md** - Comprehensive testing guide
- **PART5_COMPLETION_SUMMARY.md** - Final completion report

### External Tools

- **Swagger UI**: https://swagger.io/tools/swagger-ui/
- **ReDoc**: https://github.com/Redocly/redoc
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/

### Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the OpenAPI specification
3. Consult the test plan for usage examples
4. Contact the API development team

---

## ✅ Checklist for Teams

### For Developers

- [ ] Review interactive docs to understand API structure
- [ ] Bookmark the documentation page
- [ ] Test key endpoints using cURL examples
- [ ] Integrate API calls into application
- [ ] Reference OpenAPI spec for detailed schemas

### For QA Engineers

- [ ] Review API_TEST_PLAN.md
- [ ] Use interactive docs to explore all endpoints
- [ ] Create Postman collection from cURL examples
- [ ] Execute test cases systematically
- [ ] Report issues with endpoint references

### For Product Managers

- [ ] Understand API capabilities by domain
- [ ] Review endpoint coverage for features
- [ ] Identify any missing functionality
- [ ] Plan feature development based on API structure

### For DevOps

- [ ] Deploy interactive docs to accessible location
- [ ] Set up monitoring for API endpoints
- [ ] Configure CI/CD for API testing
- [ ] Ensure documentation stays updated

---

## 🎉 Summary

You now have a complete interactive documentation system that:

✅ **Visualizes all 128 API endpoints** in an intuitive interface
✅ **Provides instant search** across all endpoints
✅ **Shows complete details** for each endpoint
✅ **Includes ready-to-use examples** for testing
✅ **Works offline** after initial load
✅ **Supports all devices** with responsive design
✅ **Complements the test plan** for QA workflows
✅ **Serves as living documentation** for the team

**Next Steps:**
1. Open `karvia_api_docs_interactive.html` in your browser
2. Explore the API structure by domain
3. Test key endpoints using the cURL examples
4. Share the documentation link with your team
5. Begin systematic testing using the test plan

---

**Version**: 1.0.0
**Created**: October 27, 2025
**Status**: Production Ready
**Format**: HTML5 + Embedded JSON
**Dependencies**: None (fully self-contained)
