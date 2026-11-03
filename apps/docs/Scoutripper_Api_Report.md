# **SCOUTRIPPER Backend API Documentation** 

Complete Technical Reference • 83 Active Endpoints 

_Includes final route reconciliation audit and audited corrections_ 

## **Document Guide** 

This document organizes the supplied Scoutripper backend API reference into a consistent, developer-friendly format. 

Each endpoint preserves the supplied purpose, authentication/authorization rules, middleware, parameters, request/response examples, error conditions, and verified side effects where provided. 

The document contains the supplied Scoutripper backend API reference in a consistent, developer-friendly format. 

### **API Section Index** 

- SECTION 1: Auth APIs 

- SECTION 2: Location APIs 

- SECTION 3: Master Trek APIs 

- SECTION 4: Onboarding APIs 

- SECTION 5: Admin Vendor APIs 

- Section 6: Team APIs (/api/team) 

- Section 7: Package APIs (/api/package) 

- Section 8: Booking APIs (/api/booking) 

- Section 9: Payment APIs (/api/payment) 

- Section 10: Review APIs (/api/review) 

- Section 11: Vendor APIs (/api/vendor) 

- Section 12: Root System API (/) 

## **Section 1: Auth APIs** 

Mounted Base Path: /api/auth (via authRoutes in 

<mark>src/routes/auth.route.ts</mark> 

) 

### **1. Google Login / Signup** 

**Method: POST** 

**Endpoint: /api/auth/google** 

**Purpose: Used to authenticate a user for login and signup. Authentication:** Not Required **Authorization / Role:** Public **Middleware:** None 

#### **Headers:** 

Content-Type: application/json (Required) User-Agent: string (Optional, captured for session audit tracking) X-Forwarded-For / X-Real-IP: string (Optional, captured for IP audit tracking) 

**Path Parameters** None 

**Query Parameters** None 

#### **Request Body** 

{ "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1NiJ9..." } 

#### **Request Fields** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|||||Valid Google OAuth2|
|idToken|string|Yes|Min length 1|OpenID Connect JWT token<br>string|



#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Google login successful", "data": { "name": "Ayaan Khan", "email": "ayaan@example.com", "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxOWEwNmIwLTNmZjktNzE2ZC05YzZlLTUyYmIwMDZiNzhkNCI... " } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request / idToken is missingor empty|Zod Validation|
|401|Invalid Google token (Google OAuth token<br>verification failed or missingemail claim)|google.service.ts / Controller|
|403|Account is disabled(User record found but|auth.service.ts|



|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
||status !== "ACTIVE" or isDeleted === true)||
|500|Invalid Google token(Controller catch fallback)|auth.controller.ts|



#### **Error Response Examples:** 

Status Code: 401 

{ "statusCode": 401, "success": false, "message": "Invalid Google token" } 

Status Code: 403 

{ "statusCode": 403, "success": false, "message": "Account is disabled" } 

#### **Verified Side Effects:** 

Inserts new User record if user logging in for the first time. 

Inserts new Session record with Argon2-hashed refresh token. Sets HTTP-only refreshToken cookie. 

### **2. Logout Current Session** 

**Method: POST** 

#### **Endpoint: /api/auth/logout** 

**Purpose:** Terminates the caller's active session. Marks the session as revoked (isRevoked = true) in the database so that its refresh token can never be rotated again, and clears the refreshToken cookie from the client browser. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** Any Authenticated Role (USER, VENDOR, ADMIN) 

**Middleware:** authMiddleware 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

#### **Path Parameters** 

None 

**Query Parameters** 

None 

#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Logged out successfully" } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|401|Unauthorized - Missing token (Authorization<br>header missingor does not start with Bearer)|auth.middleware.ts|
|401|Unauthorized - Invalid or expired token(JWT|auth.middleware.ts|



|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
||access token verification failed)||
|401|Unauthorized (Context missing userId or<br>sessionId)|auth.controller.ts|
|404|Session not found (Session ID does not exist in<br>database or was alreadyrevoked)|auth.service.ts|
|500|An error occurred duringlogout(Fallback catch)|auth.controller.ts|



#### **Error Response Examples:** 

Status Code: 401 

{ "statusCode": 401, "success": false, "message": "Unauthorized - Missing token" } 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Session not found" } 

#### **Verified Side Effects:** 

Updates Session.isRevoked = true in PostgreSQL. Clears client HTTP-only cookie. 

### **3. Refresh Access Token** 

**Method: POST Endpoint: /api/auth/refresh Purpose: Used to refresh the access token. Authentication:** Required via HTTP-only Cookie **Authorization / Role:** Public / Session Holder **Middleware:** None **Headers:** Cookie: refreshToken=<token> (Required) **Path Parameters** None **Query Parameters** None **Request Body** None **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Token refreshed successfully", "data": { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxOWEwNmIwLTNmZjktNzE2ZC05YzZlLTUyYmIwMDZiNzhkNCI... " 

} } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|401|Refresh token missing (No refreshToken cookie<br>found in incomingrequest headers)<br>i|auth.controller.ts|
|401|Invalid or expired refresh token (JWT verification<br>failed on refresh token string)|auth.service.ts|
|401|Session not found (Session ID from token<br>payload does not exist in database)|auth.service.ts|
|401|Invalid session (Session user ID does not match<br>the tokenpayload user ID)|auth.service.ts|
|401|Session has been revoked (Database session<br>record has isRevoked === true)|auth.service.ts|
|401|Session has expired (Database session expiresAt<br><= new Date())<br>i|auth.service.ts|
|401|Invalid refresh token (Argon2 hash verification<br>failed against stored hash)|auth.service.ts|
|500|An error occurred while refreshing token<br>(Controller fallback)|auth.controller.ts|



#### **Error Response Examples:** 

Status Code: 401 

{ "statusCode": 401, "success": false, "message": "Session has been revoked" } 

#### **Verified Side Effects:** 

Mutates Session.refreshTokenHash and Session.expiresAt in PostgreSQL. 

Rotates client-side refreshToken cookie. 

## **Section 2: Location APIs** 

Mounted Base Path: /api/location (via LocationRoutes in 

<mark>src/routes/location.route.ts</mark> 

) 

### **4. Search Locations** 

**Method: GET** 

#### **Endpoint: /api/location/** 

**Purpose:** Searches administrative and geographical locations (states, districts, sub-districts, local bodies, villages) using case-insensitive partial name matching with configurable result limits. 

**Authentication:** Not Required 

**Authorization / Role:** Public 

**Middleware:** None 

**Headers:** 

None 

**Path Parameters** 

None 

**Query Parameters** 

|**Parameter**|**Type**|**Required**|**Default**|**Constraints**|**Description**|
|---|---|---|---|---|---|
|search|string|Yes|—|Min 1 char|Location name query<br>to match|
||||||Maximum number of|
|limit|number|No|10|Min 1, Max 50|location results to<br>return|



#### **Request Body** 

None 

**Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Locations fetched successfully", "data": [ { "id": "DISTRICT:18", "name": "Kangra", "type": "DISTRICT", "sourceCode": "18", "localBodyType": null, "parentId": "STATE:2", "createdAt": "2026-09-10T15:49:26.990Z", "updatedAt": "2026-09-10T16:02:29.681Z" }, { "id": "SUBDISTRICT:100", "name": "Kangra", "type": "SUBDISTRICT", "sourceCode": "100", "localBodyType": null, "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:50:03.699Z", "updatedAt": "2026-09-10T16:03:09.524Z" }, { "id": "ULB:248213", "name": "Kangra", "type": "URBAN_LOCAL_BODY", "sourceCode": "248213", "localBodyType": "Municipal Council", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } ] } 

**Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Search query is required (Query string search is<br>omitted or empty)|location.controller.ts / Zod|
|500|Failed to fetch locations(Databasequeryfailure)|location.controller.ts|



**Error Response Examples:** 

Status Code: 400 

{ "statusCode": 400, "success": false, "message": "Search query is required" } 

**Verified Side Effects:** 

Read-only database query. 

### **5. Get Location by ID with Hierarchy** 

**Method: GET** 

**Endpoint: /api/location/{id}** 

**Purpose:** Retrieves specific location details along with a fully resolved upward breadcrumb trail representing its administrative hierarchy (e.g., Village $\rightarrow$ Tehsil $\rightarrow$ District $\rightarrow$ State). 

**Authentication:** Not Required 

**Authorization / Role:** Public 

**Middleware:** None 

**Headers:** 

None 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|id|string|Yes|Unique location identifier (e.g.<br>ULB:252220)|



#### **Query Parameters** 

None 

#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Location fetched successfully", "data": { "id": "ULB:252220", "name": "Dharamshala", "type": "MUNICIPAL_CORPORATION", "sourceCode": "252220", "localBodyType": "URBAN", "parentId": "DIST:12", "breadcrumb": [ { "id": "ULB:252220", "name": "Dharamshala", "type": "MUNICIPAL_CORPORATION" }, { "id": "DIST:12", "name": "Kangra", "type": "DISTRICT" }, { 

"id": "STATE:HP", "name": "Himachal Pradesh", "type": "STATE" } ] } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Location id is required (Path parameter id is<br>empty)|location.controller.ts|
|404|Location not found (No location record matching<br>id exists in database)|location.service.ts|
|500|Failed to fetch location(Databasequeryerror)|location.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Location not found" } 

#### **Verified Side Effects:** 

Read-only hierarchical query traversal. 

### **6. Get Direct Child Locations** 

**Method: GET** 

**Endpoint: /api/location/{id}/children** 

**Purpose:** Fetches all direct child administrative subdivisions situated directly under a parent location ID (e.g., all tehsils under a district). 

**Authentication:** Not Required 

**Authorization / Role:** Public 

**Middleware:** None 

#### **Headers:** 

None 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|id|string|Yes|Parent location unique identifier|



#### **Query Parameters** 

None 

#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Location children fetched successfully", "data": [ { "id": "SUBDISTRICT:100", 

"name": "Kangra", "type": "SUBDISTRICT", "sourceCode": "100", "localBodyType": null, "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:50:03.699Z", "updatedAt": "2026-09-10T16:03:09.524Z" }, { "id": "ULB:248213", "name": "Kangra", "type": "URBAN_LOCAL_BODY", "sourceCode": "248213", "localBodyType": "Municipal Council", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } ] } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|401|Refresh token missing (Controller legacy fallback<br>guard whenparameter is empty)|location.controller.ts|
|404|Location not found (Parent location with<br>specified ID does not exist)|location.service.ts|
|500|Failed to fetch location children (Database query<br>error)|location.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Location not found" } 

**Verified Side Effects:** 

Read-only database query. 

## **Section 3: Master Trek APIs** 

Mounted Base Path: /api/master-trek (via MasterTrekRoutes in 

<mark>src/routes/master-trek.route.ts</mark> 

) 

### **7. Create Master Trek** 

**Method: POST** 

**Endpoint: /api/master-trek/** 

**Purpose:** Provisions a canonical Master Trek record containing standard metadata, geographic coordinates, physical overview, routes with daily itineraries, activities, FAQs, and nearby place linkages. Automatically computes a URLfriendly slug from the trek name. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

**Headers: Authorization:** Bearer <accessToken> (Required) Content-Type: application/json (Required) **Path Parameters** None **Query Parameters** None **Request Body** 

{ "name": "Kedarkantha Trek", "shortDescription": "Classic winter snow trek in Uttarakhand", "description": "Comprehensive guide through pine forests and summit ridges...", "tagline": "The Queen of Winter Treks", "difficulty": "EASY", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 1, "locationId": "LOC:SANKRI", "latitude": 31.074, "longitude": 78.182, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "Detailed overview...", "howToReach": "Drive from Dehradun to Sankri...", "fitnessInfo": "Basic cardio fitness required...", "safetyInfo": "Acclimatization guidelines...", "permitInfo": "Forest entry permits required at Sankri...", "sustainabilityInfo": "Leave No Trace principles...", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/cover.jpg", "videoUrl": "https://youtube.com/watch?v=example", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/gallery1.jpg" ], "status": "ACTIVE", "activities": [ { "name": "Camping", "description": "Wilderness camping under stars", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camp.png" } ], "routes": [ { "name": "Standard Route via Sankri", "description": "Traditional route starting from Sankri base camp", "distanceKm": 20, "difficulty": "EASY", "elevationGain": 1890, "ascentTime": "3 Days", "descentTime": "2 Days", "startPoint": "Sankri", "endPoint": "Sankri", "isPopular": true, "isDefault": true, "itineraryDays": [ 

{ "dayNumber": 1, "title": "Drive from Dehradun to Sankri", "description": "Scenic 210 km drive through Mussoorie and Purola", "startLocation": "Dehradun", "endLocation": "Sankri", "distanceKm": 210, "duration": "8 hours", "altitude": 1920, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day1.jpg" ], "activities": [ { "name": "Scenic Drive" } ] } ] } ], "faqs": [ { "question": "Is Kedarkantha suitable for beginners?", "answer": "Yes, it is one of India's best beginner winter snow treks.", "order": 1 } ], "nearbyPlaces": [ { "name": "Juda Ka Talab", "description": "High altitude frozen lake", "locationId": "LOC:SANKRI", "latitude": 31.08, "longitude": 78.19, "imageUrl": "https://res.cloudinary.com/demo/image/upload/jkt.jpg", "distanceFromTrek": "On route (4 km from base)", "travelTime": "3 hours trek" } ] } 

#### **Request Fields** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|name|string|Yes|Min 1 char|Canonical name of master<br>trek|
|shortDescription|string|Yes|Min 1 char|Summary teaser for catalog<br>listings|
|description|string|Yes|Min 1 char|Full long-form markdown<br>description|
|tagline|string|No|Optional|Promotional tagline|
|difficulty|enum|Yes|EASY, MODERATE,<br>DIFFICULT, EXPERT|Trek difficulty classification|
|durationDays|number|Yes|Positive integer|Total days required|
|maxAltitude|number|Yes|Positive number|Peak altitude in meters|
|distanceKm|number|Yes|Positive number|Total trail distance|
|distinctRoutes|number|Yes|Positive integer|Number of navigable route<br>options|
|locationId|string|Yes|Min 1 char|Startingbase Location ID|
|latitude / longitude|number|Yes|Coordinate boundaries|Geographic coordinates of<br>base|
|bestSeason|string|Yes|Min 1 char|Optimal operatingmonths|



|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|beginnerFriendly|boolean|Yes|Boolean|Suitable for first-time<br>trekkers|
|overview|string|Yes|Min 1 char|Detailed terrain and climate<br>overview|
|howToReach|string|Yes|Min 1 char|Transit and road logistics|
|fitnessInfo|string|Yes|Min 1 char|Physical conditioning<br>prerequisites|
|safetyInfo|string|Yes|Min 1 char|Acclimatization and risk<br>protocols|
|permitInfo|string|Yes|Min 1 char|Forest and environmental<br>permitguidelines|
|sustainabilityInfo|string|Yes|Min 1 char|Eco-sensitivity and waste<br>guidelines|
|coverImageUrl|string|Yes|Valid URL|Main hero image URL|
|videoUrl|string|No|Valid URL|Optional teaser video|
|galleryImages|string[]|Yes|Arrayof valid URLs|MediagalleryURLs|
|status|enum|Yes|DRAFT, ACTIVE, INACTIVE,<br>ARCHIVED|Catalog visibility state|
|activities|array|Yes|Array of objects|Activities associated with<br>trek|
|routes|array|Yes|Array of route objects|Complete route definitions<br>and days|
|faqs|array|Yes|Array of FAQ objects|Questions, answers, and<br>displayorder|
|nearbyPlaces|array|Yes|Arrayofplace objects|Nearby points of interest|



#### **Success Response (HTTP 201)** 

{ "statusCode": 201, "success": true, "message": "Trek created successfully", "data": { "id": "01a0f0c5-c374-76be-9292-0f60c310a7e7", "name": "maldives", "slug": "maldives", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ 

"https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-30T05:24:47.655Z", "updatedAt": "2026-09-30T05:24:47.655Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ] } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body/ validation failure|Zod Validator|
|400|Invalid trek location (The supplied locationId<br>does not exist in the Location table)|master-trek.service.ts|
|401|Unauthorized - Missing token / Unauthorized -<br>Invalid or expired token|auth.middleware.ts|
|403|Forbidden - Admin only / Forbidden - Insufficient<br>permissions|auth.middleware.ts|
|500|Failed to create trek (Database transaction<br>failure)|master-trek.service.ts / Controller|



#### **Error Response Examples:** 

Status Code: 400 

{ "statusCode": 400, "success": false, "message": "Invalid trek location" } 

Status Code: 403 

{ "statusCode": 403, "success": false, "message": "Forbidden - Insufficient permissions" } 

#### **Verified Side Effects:** 

Inserts MasterTrek, TrekRoute, TrekItineraryDay, Activity, TrekFaq, NearbyPlace, and TrekNearbyPlace rows in PostgreSQL. 

### **8. Update Master Trek** 

**Method: PATCH** 

**Endpoint: /api/master-trek/{id}** 

**Purpose:** Updates an existing Master Trek catalog record. Replaces or mutates root metadata, recalculates the slug if the name changes, replaces routes and itinerary days if provided, synchronizes FAQs, and re-links nearby places. 

**Authentication:** Required (Bearer Token) **Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

Content-Type: application/json (Required) 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|id|string|Yes|Master Trek unique identifier|



**Query Parameters** None 

#### **Request Body** 

{ "name": "maldives", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "activities": [ { "name": "Camping", "description": "Night camping activity", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png" } ], "routes": [ { "name": "Standard Route", "description": "Most commonly used route for this trek.", "distanceKm": 20, "difficulty": "MODERATE", "elevationGain": 1200, "ascentTime": "7 hours", "descentTime": "5 hours", "startPoint": "Sankri", "endPoint": "Kedarkantha Summit", "isPopular": true, "isDefault": true, "itineraryDays": [ { "dayNumber": 1, 

"title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg", "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg" ], "activities": [ { "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png" } ] } ] } ], "nearbyPlaces": [ { "name": "Mori Village", "description": "A nearby Himalayan village.", "locationId": "DISTRICT:56", "latitude": 31.05, "longitude": 78.12, "imageUrl": "https://res.cloudinary.com/demo/image/upload/mori.jpg", "distanceFromTrek": 15, "travelTime": "30 minutes" } ], "faqs": [ { "question": "What is the best time to visit?", "answer": "The best time to visit is from December to April.", "order": 0 } ] } 

#### **Request Fields** 

All fields from CreateMasterTrekSchema are accepted as optional properties in UpdateMasterTrekSchema. **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Trek updated successfully", "data": { "id": "01a0f0c5-c374-76be-9292-0f60c310a7e7", "name": "maldives", "slug": "maldives", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, 

"maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-30T05:24:47.655Z", "updatedAt": "2026-09-30T05:36:25.770Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" }, "createdBy": { "id": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "googleId": "104324559969128208472", "email": "ayaanah776@gmail.com", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg", "bio": null, "role": "ADMIN", "status": "ACTIVE", "isDeleted": false, "phone": "9876543210", "address": "Malviya Nagar", "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": "302017", "languages": [ "Hindi", "English" 

], "createdAt": "2026-09-08T03:18:46.467Z", "updatedAt": "2026-09-08T03:42:00.451Z" }, "activities": [ { "id": "01a0954c-4353-7009-904d-d20163223ec4", "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png", "trekIds": [ "01a0954c-495e-7f42-9f06-a302c567febf", "01a095d5-45de-7b9e-9fed-b76dafe124e6", "01a0d2a1-9ca7-76aa-b775-f1b5a15dc2b9", "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "01a0f0c5-c374-76be-9292-0f60c310a7e7" ], "itineraryDayIds": [], "createdAt": "2026-09-12T11:06:38.310Z", "updatedAt": "2026-09-30T05:36:25.155Z" } ], "routes": [ { "id": "01a0f0d0-6aa7-72d0-b689-12c0edb3a76b", "masterTrekId": "01a0f0c5-c374-76be-9292-0f60c310a7e7", "name": "Standard Route", "description": "Most commonly used route for this trek.", "distanceKm": 20, "difficulty": "MODERATE", "elevationGain": 1200, "ascentTime": "7 hours", "descentTime": "5 hours", "startPoint": "Sankri", "endPoint": "Kedarkantha Summit", "isPopular": true, "isDefault": true, "createdAt": "2026-09-30T05:36:25.770Z", "updatedAt": "2026-09-30T05:36:25.770Z", "itineraryDays": [ { "id": "01a0f0d0-6aa7-72d0-b689-12bf80a6ccea", "routeId": "01a0f0d0-6aa7-72d0-b689-12c0edb3a76b", "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg", "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg" ], "createdAt": "2026-09-30T05:36:25.770Z", 

"updatedAt": "2026-09-30T05:36:25.770Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "activities": [ { "id": "01a0954c-4353-7009-904d-d20163223ec4", "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png", "trekIds": [ "01a0954c-495e-7f42-9f06-a302c567febf", "01a095d5-45de-7b9e-9fed-b76dafe124e6", "01a0d2a1-9ca7-76aa-b775-f1b5a15dc2b9", "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "01a0f0c5-c374-76be-9292-0f60c310a7e7" ], "itineraryDayIds": [], "createdAt": "2026-09-12T11:06:38.310Z", "updatedAt": "2026-09-30T05:36:25.155Z" } ] } ] } ], "nearbyPlaces": [ { "id": "01a0f0d0-75db-7bbd-b3b7-660835736c2c", "trekId": "01a0f0c5-c374-76be-9292-0f60c310a7e7", "nearbyPlaceId": "01a0f0d0-7416-7bbf-9c89-2955ceec422d", "distanceFromTrek": 15, "travelTime": "30 minutes", "nearbyPlace": { "id": "01a0f0d0-7416-7bbf-9c89-2955ceec422d", "name": "Mori Village", "description": "A nearby Himalayan village.", "locationId": "DISTRICT:56", "latitude": 31.05, "longitude": 78.12, "imageUrl": "https://res.cloudinary.com/demo/image/upload/mori.jpg", "createdAt": "2026-09-30T05:36:28.184Z", "updatedAt": "2026-09-30T05:36:28.184Z", "location": { "id": "DISTRICT:56", "name": "Udam Singh Nagar", "type": "DISTRICT", "sourceCode": "56", "localBodyType": null, "parentId": "STATE:5", "createdAt": "2026-09-10T15:49:26.994Z", "updatedAt": "2026-09-10T16:02:29.686Z" } } } ], 

"faqs": [ { "id": "01a0f0d0-6aa7-72d0-b689-12c1e188765b", "masterTrekId": "01a0f0c5-c374-76be-9292-0f60c310a7e7", "question": "What is the best time to visit?", "answer": "The best time to visit is from December to April.", "order": 0, "createdAt": "2026-09-30T05:36:25.770Z", "updatedAt": "2026-09-30T05:36:25.770Z" } ], "packages": [] } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Trek ID is required(Pathparameter id is empty)|master-trek.controller.ts|
|400|Invalid trek location (Supplied locationId does<br>not exist in Location table)|master-trek.service.ts|
|401|Unauthorized|auth.middleware.ts|
|403|Forbidden - Admin only|auth.middleware.ts|
|404|Trek not found(Master Trek ID does not exist)|master-trek.service.ts|
|404|Trek not found after update (Post-mutation<br>retrieval failure)|master-trek.service.ts|
|500|Failed to update trek(Database mutation error)|master-trek.service.ts / Controller|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Trek not found" } 

#### **Verified Side Effects:** 

Mutates MasterTrek row; optionally deletes and re-creates child TrekRoute, TrekItineraryDay, TrekFaq, and TrekNearbyPlace rows. 

### **9. Delete Master Trek** 

**Method: DELETE** 

**Endpoint: /api/master-trek/{id}** 

**Purpose:** Permanently removes a Master Trek catalog record and cascades deletion to all attached routes, itinerary days, FAQs, and nearby place relations. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|id|string|Yes|Master Trek unique identifier|



#### **Query Parameters** 

None 

#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Trek deleted successfully", "data": { "id": "019a06b0-00bf-790e-937b-32ec6617b322" } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Trek ID is required|master-trek.controller.ts|
|401|Unauthorized|auth.middleware.ts|
|403|Forbidden - Admin only|auth.middleware.ts|
|404|Trek not found(Trek ID does not exist)|master-trek.service.ts|
|500|Failed to delete trek|master-trek.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Trek not found" } 

#### **Verified Side Effects:** 

Deletes MasterTrek and associated child rows from database. 

### **10. Get All Master Treks for Admin** 

**Method: GET** 

#### **Endpoint: /api/master-trek/** 

**Purpose:** Fetches a paginated catalog of all Master Treks regardless of status (including DRAFT, INACTIVE, and ACTIVE) for the administrative console with cursor-based pagination. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

#### **Path Parameters** 

None 

#### **Query Parameters** 

|**Parameter**|**Type**|**Required**|**Default**|**Constraints**|**Description**|
|---|---|---|---|---|---|
|cursor|string|No|—|Valid UUID|Cursor identifier for<br>pagination|
|limit|number|No|10|Min 1, Max 50|Page size limit|



#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Treks fetched successfully", "data": { "treks": [ { "id": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Shimla", "slug": "shimla", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-24T11:18:21.657Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } }, { "id": "01a095d5-45de-7b9e-9fed-b76dafe124e6", 

"name": "Kedarkantha Trek", "slug": "kedarkantha-trek", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-12T13:36:17.394Z", "updatedAt": "2026-09-12T13:36:17.394Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } } ], "nextCursor": null, "hasNextPage": false } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|401|Unauthorized|auth.middleware.ts|
|403|Forbidden - Admin only|auth.middleware.ts|
|500|Failed to fetch treks|master-trek.controller.ts|



**Error Response Examples:** Status Code: 403 

{ "statusCode": 403, "success": false, "message": "Forbidden - Insufficient permissions" } 

**Verified Side Effects:** 

Read-only database query. 

### **11. Get All Master Treks for Vendor** 

**Method: GET** 

**Endpoint: /api/master-trek/vendor** 

**Purpose:** Fetches all active Master Treks available for verified vendors to select as the basis for commercial package creation. 

**Authentication:** Required (Bearer Token) **Authorization / Role:** VENDOR **Middleware:** authMiddleware, requireRole("VENDOR") 

**Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

**Path Parameters** 

None 

#### **Query Parameters** 

|**Parameter**|**Type**|**Required**|**Default**|**Constraints**|**Description**|
|---|---|---|---|---|---|
|cursor|string|No|—|Valid UUID|Cursor identifier|
|limit|number|No|10|Min 1, Max 50|Page size limit|



#### **Request Body** 

None 

**Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Treks fetched successfully", "data": { "treks": [ { "id": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Shimla", "slug": "shimla", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, 

"bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-24T11:18:21.657Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } }, { "id": "01a095d5-45de-7b9e-9fed-b76dafe124e6", "name": "Kedarkantha Trek", "slug": "kedarkantha-trek", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", 

"videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-12T13:36:17.394Z", "updatedAt": "2026-09-12T13:36:17.394Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } } ], "nextCursor": null, "hasNextPage": false } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|401|Unauthorized|auth.middleware.ts|
|403|Forbidden - Insufficient permissions / Vendor role<br>required|auth.middleware.ts|
|500|Failed to fetch treks|master-trek.controller.ts|



**Error Response Examples:** 

Status Code: 403 

{ "statusCode": 403, "success": false, "message": "Forbidden - Insufficient permissions" } 

**Verified Side Effects:** 

Read-only database query. 

### **12. Get Master Trek for Vendor by ID** 

**Method: GET** 

**Endpoint: /api/master-trek/vendor/{id}** 

**Purpose:** Fetches full Master Trek details, including all standard routes and pre-configured daily itineraries, allowing a vendor to inspect route specifics before drafting a commercial package. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** VENDOR 

**Middleware:** authMiddleware, requireRole("VENDOR") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|id|string|Yes|Master Trek unique identifier|



#### **Query Parameters** 

None 

**Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Trek fetched successfully", "data": { "id": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Shimla", "slug": "shimla", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-24T11:18:21.657Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", 

"type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" }, "createdBy": { "id": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "googleId": "104324559969128208472", "email": "ayaanah776@gmail.com", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg", "bio": null, "role": "ADMIN", "status": "ACTIVE", "isDeleted": false, "phone": "9876543210", "address": "Malviya Nagar", "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": "302017", "languages": [ "Hindi", "English" ], "createdAt": "2026-09-08T03:18:46.467Z", "updatedAt": "2026-09-08T03:42:00.451Z" }, "activities": [ { "id": "01a0954c-4353-7009-904d-d20163223ec4", "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png", "trekIds": [ "01a0954c-495e-7f42-9f06-a302c567febf", "01a095d5-45de-7b9e-9fed-b76dafe124e6", "01a0d2a1-9ca7-76aa-b775-f1b5a15dc2b9", "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "01a0f0c5-c374-76be-9292-0f60c310a7e7" ], "itineraryDayIds": [], "createdAt": "2026-09-12T11:06:38.310Z", "updatedAt": "2026-09-30T05:36:25.155Z" } ], "routes": [ { "id": "01a0d325-0b32-7d2a-8b72-b14a63fd0640", "masterTrekId": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Standard Route", "description": "Most commonly used route for this trek.", "distanceKm": 20, "difficulty": "MODERATE", 

"elevationGain": 1200, "ascentTime": "7 hours", "descentTime": "5 hours", "startPoint": "Sankri", "endPoint": "Kedarkantha Summit", "isPopular": true, "isDefault": true, "createdAt": "2026-09-24T11:20:15.416Z", "updatedAt": "2026-09-24T11:20:15.416Z", "itineraryDays": [ { "id": "01a0d325-0b31-7e5f-96d1-95365bf32f98", "routeId": "01a0d325-0b32-7d2a-8b72-b14a63fd0640", "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg", "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg" ], "createdAt": "2026-09-24T11:20:15.416Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "activities": [ { "id": "01a0954c-4353-7009-904d-d20163223ec4", "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png", "trekIds": [ "01a0954c-495e-7f42-9f06-a302c567febf", "01a095d5-45de-7b9e-9fed-b76dafe124e6", "01a0d2a1-9ca7-76aa-b775-f1b5a15dc2b9", "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "01a0f0c5-c374-76be-9292-0f60c310a7e7" ], "itineraryDayIds": [], "createdAt": "2026-09-12T11:06:38.310Z", "updatedAt": "2026-09-30T05:36:25.155Z" } ] } ] } ], "nearbyPlaces": [ { "id": "01a0d325-155f-7621-b92a-6157602b2a27", "trekId": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", 

"nearbyPlaceId": "01a0d325-13c5-71b4-a984-f **f** 544007c80", "distanceFromTrek": 15, "travelTime": "30 minutes", "nearbyPlace": { "id": "01a0d325-13c5-71b4-a984-f **f** 544007c80", "name": "Mori Village", "description": "A nearby Himalayan village.", "locationId": "DISTRICT:56", "latitude": 31.05, "longitude": 78.12, "imageUrl": "https://res.cloudinary.com/demo/image/upload/mori.jpg", "createdAt": "2026-09-24T11:20:17.607Z", "updatedAt": "2026-09-24T11:20:17.607Z", "location": { "id": "DISTRICT:56", "name": "Udam Singh Nagar", "type": "DISTRICT", "sourceCode": "56", "localBodyType": null, "parentId": "STATE:5", "createdAt": "2026-09-10T15:49:26.994Z", "updatedAt": "2026-09-10T16:02:29.686Z" } } } ], "faqs": [ { "id": "01a0d325-0b32-7d2a-8b72-b14b34a3ed1e", "masterTrekId": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "question": "What is the best time to visit?", "answer": "The best time to visit is from December to April.", "order": 0, "createdAt": "2026-09-24T11:20:15.416Z", "updatedAt": "2026-09-24T11:20:15.416Z" } ] } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Trek ID is required|master-trek.controller.ts|
|401|Unauthorized|auth.middleware.ts|
|404|Trek not found(No master trek matchingID)|master-trek.service.ts|
|500|Failed to fetch trek|master-trek.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Trek not found" } 

**Verified Side Effects:** 

Read-only database query. 

### **13. Get All Master Treks for Public/User** 

**Method: GET** 

**Endpoint: /api/master-trek/public** 

**Purpose:** Fetches published Master Treks for consumer discovery. For each trek, dynamically inspects all published package schedules to calculate and display the lowest available startingPrice and corresponding currency. 

**Authentication:** Not Required **Authorization / Role:** Public 

**Middleware:** None 

**Headers:** 

None 

#### **Path Parameters** 

None 

#### **Query Parameters** 

|**Parameter**|**Type**|**Required**|**Default**|**Constraints**|**Description**|
|---|---|---|---|---|---|
|cursor|string|No|—|Valid UUID|Cursor identifier|
|limit|number|No|10|Min 1, Max 50|Page size limit|



#### **Request Body** 

None 

**Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Treks fetched successfully", "data": { "treks": [ { "id": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Shimla", "slug": "shimla", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ 

"https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-24T11:18:21.657Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" }, "packages": [], "startingPrice": null, "currency": null }, { "id": "01a095d5-45de-7b9e-9fed-b76dafe124e6", "name": "Kedarkantha Trek", "slug": "kedarkantha-trek", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-12T13:36:17.394Z", 

"updatedAt": "2026-09-12T13:36:17.394Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" }, "packages": [ { "id": "01a0d6db-1046-7108-b80e-1d52334cf02f", "locationId": "STATE:5", "difficulty": "MODERATE", "distanceKm": 20, "createdByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "teamId": null, "masterTrekId": "01a095d5-45de-7b9e-9fed-b76dafe124e6", "routeId": "01a095d5-45de-7b9e-9fed-b76ca94e4b4e", "galleryImages": [ "https://example.com/kedarkantha-1.jpg", "https://example.com/kedarkantha-2.jpg" ], "scheduleType": "FIXED", "inclusions": [ "Accommodation (Tents/Homestays)", "All Meals during the trek", "Qualified Trek Leader" ], "exclusions": [ "Cab fare to Jobra and from Chattru to Manali is not included" ], "packingList": [ "Trekking shoes", "Warm jacket", "Water bottle" ], "fitnessAndExperienceRequirement": "Participants must be able to jog 5 km in 30 minutes. Previous highaltitude experience is recommended but not mandatory.", "title": "Kedarkantha Winter Trek", "description": "A scenic winter trek through the Himalayas.", "visibility": "PUBLIC", "status": "PUBLISHED", "durationDays": 6, "meetingPoint": null, "instructions": null, "createdAt": "2026-09-25T04:37:55.920Z", "updatedAt": "2026-09-25T10:03:38.212Z", "schedules": [] } ], 

"startingPrice": null, "currency": null } ], "nextCursor": null, "hasNextPage": false } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|500|Failed to fetch treks(Databasequeryerror)|master-trek.controller.ts|



#### **Error Response Examples:** 

Status Code: 500 

{ "statusCode": 500, "success": false, "message": "Failed to fetch treks" } 

#### **Verified Side Effects:** 

Read-only query and runtime price aggregation. 

### **14. Get Master Trek for Public/User by ID** 

**Method: GET** 

#### **Endpoint: /api/master-trek/public/{id}** 

**Purpose:** Fetches complete consumer-facing Master Trek details by ID, including route overviews, daily itineraries, activities, FAQs, nearby attractions, and the lowest calculated startingPrice across all vendor packages. **Authentication:** Not Required 

**Authorization / Role:** Public 

**Middleware:** None 

#### **Headers:** 

None 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|id|string|Yes|Master Trek unique identifier|



#### **Query Parameters** 

None 

#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Trek fetched successfully", "data": { "id": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Shimla", "slug": "shimla", "shortDescription": "A popular winter trek in Uttarakhand.", 

"description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-24T11:18:21.657Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" }, "activities": [ { "id": "01a0954c-4353-7009-904d-d20163223ec4", "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png", "trekIds": [ "01a0954c-495e-7f42-9f06-a302c567febf", "01a095d5-45de-7b9e-9fed-b76dafe124e6", "01a0d2a1-9ca7-76aa-b775-f1b5a15dc2b9", "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "01a0f0c5-c374-76be-9292-0f60c310a7e7" ], "itineraryDayIds": [], "createdAt": "2026-09-12T11:06:38.310Z", 

"updatedAt": "2026-09-30T05:36:25.155Z" } ], "routes": [ { "id": "01a0d325-0b32-7d2a-8b72-b14a63fd0640", "masterTrekId": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Standard Route", "description": "Most commonly used route for this trek.", "distanceKm": 20, "difficulty": "MODERATE", "elevationGain": 1200, "ascentTime": "7 hours", "descentTime": "5 hours", "startPoint": "Sankri", "endPoint": "Kedarkantha Summit", "isPopular": true, "isDefault": true, "createdAt": "2026-09-24T11:20:15.416Z", "updatedAt": "2026-09-24T11:20:15.416Z", "itineraryDays": [ { "id": "01a0d325-0b31-7e5f-96d1-95365bf32f98", "routeId": "01a0d325-0b32-7d2a-8b72-b14a63fd0640", "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg", "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg" ], "createdAt": "2026-09-24T11:20:15.416Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "activities": [ { "id": "01a0954c-4353-7009-904d-d20163223ec4", "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png", "trekIds": [ "01a0954c-495e-7f42-9f06-a302c567febf", "01a095d5-45de-7b9e-9fed-b76dafe124e6", "01a0d2a1-9ca7-76aa-b775-f1b5a15dc2b9", "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "01a0f0c5-c374-76be-9292-0f60c310a7e7" ], "itineraryDayIds": [], "createdAt": "2026-09-12T11:06:38.310Z", 

"updatedAt": "2026-09-30T05:36:25.155Z" } ] } ] } ], "nearbyPlaces": [ { "id": "01a0d325-155f-7621-b92a-6157602b2a27", "trekId": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "nearbyPlaceId": "01a0d325-13c5-71b4-a984-f **f** 544007c80", "distanceFromTrek": 15, "travelTime": "30 minutes", "nearbyPlace": { "id": "01a0d325-13c5-71b4-a984-f **f** 544007c80", "name": "Mori Village", "description": "A nearby Himalayan village.", "locationId": "DISTRICT:56", "latitude": 31.05, "longitude": 78.12, "imageUrl": "https://res.cloudinary.com/demo/image/upload/mori.jpg", "createdAt": "2026-09-24T11:20:17.607Z", "updatedAt": "2026-09-24T11:20:17.607Z", "location": { "id": "DISTRICT:56", "name": "Udam Singh Nagar", "type": "DISTRICT", "sourceCode": "56", "localBodyType": null, "parentId": "STATE:5", "createdAt": "2026-09-10T15:49:26.994Z", "updatedAt": "2026-09-10T16:02:29.686Z" } } } ], "faqs": [ { "id": "01a0d325-0b32-7d2a-8b72-b14b34a3ed1e", "masterTrekId": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "question": "What is the best time to visit?", "answer": "The best time to visit is from December to April.", "order": 0, "createdAt": "2026-09-24T11:20:15.416Z", "updatedAt": "2026-09-24T11:20:15.416Z" } ], "packages": [], "startingPrice": null, "currency": null } } 

#### **Error Responses & Conditions** 

|**Status Code**|
|---|
|400|



|**Error Message / Condition**|**Source Layer**|
|---|---|
|Trek ID is required|master-trek.controller.ts|



|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|404|Trek not found (Master Trek does not exist or is<br>not active)|master-trek.service.ts|
|500|Failed to fetch trek|master-trek.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Trek not found" } 

#### **Verified Side Effects:** 

Read-only database query. 

### **15. Get Master Trek by ID for Admin** 

**Method: GET** 

**Endpoint: /api/master-trek/{id}** 

**Purpose:** Fetches unredacted Master Trek definition for Admin management, including audit fields (createdById, timestamps, internal status). 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|id|string|Yes|Master Trek unique identifier|



#### **Query Parameters** 

None 

**Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Treks fetched successfully", "data": { "treks": [ { "id": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "name": "Shimla", "slug": "shimla", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, 

"distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-24T11:18:21.657Z", "updatedAt": "2026-09-24T11:20:15.416Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } }, { "id": "01a095d5-45de-7b9e-9fed-b76dafe124e6", "name": "Kedarkantha Trek", "slug": "kedarkantha-trek", "shortDescription": "A popular winter trek in Uttarakhand.", "description": "A complete description of the Kedarkantha trek.", "tagline": "Walk through the snow.", "difficulty": "MODERATE", "durationDays": 6, "maxAltitude": 3810, "distanceKm": 20, "distinctRoutes": 2, "locationId": "ULB:248211", "latitude": 31.022, "longitude": 78.17, "bestSeason": "December to April", "beginnerFriendly": true, "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", 

"safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "coverImageUrl": "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg", "videoUrl": "https://example.com/kedarkantha-video.mp4", "galleryImages": [ "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg", "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg" ], "status": "DRAFT", "createdById": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "createdAt": "2026-09-12T13:36:17.394Z", "updatedAt": "2026-09-12T13:36:17.394Z", "activityIds": [ "01a0954c-4353-7009-904d-d20163223ec4" ], "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY", "sourceCode": "248211", "localBodyType": "Municipal Corporation", "parentId": "DISTRICT:18", "createdAt": "2026-09-10T15:55:50.526Z", "updatedAt": "2026-09-10T16:09:21.231Z" } } ], "nextCursor": null, "hasNextPage": false } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Trek ID is required|master-trek.controller.ts|
|401|Unauthorized|auth.middleware.ts|
|403|Forbidden - Admin only|auth.middleware.ts|
|404|Trek not found|master-trek.service.ts|
|500|Failed to fetch trek|master-trek.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Trek not found" } 

**Verified Side Effects:** 

Read-only database query. 

## **Section 4: Onboarding APIs** 

Mounted Base Path: /api/onboarding (via onboardingRoutes in 

<mark>src/routes/onboarding.route.ts</mark> 

) 

### **16. Update Onboarding Profile** 

#### **Method: PATCH** 

#### **Endpoint: /api/onboarding/profile** 

**Purpose:** Updates user profile attributes during onboarding, including first name, last name (concatenated to name), phone number, biography, avatar image URL, and physical address fields. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** Any Authenticated User 

**Middleware:** authMiddleware 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) Content-Type: application/json (Required) 

#### **Path Parameters** 

None 

#### **Query Parameters** 

None 

#### **Request Body** 

{ "firstName": "Ayaan", "lastName": "Ahmed Abbasi", "phone": "9876543250", "address": "Malviya Nagar", "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": "302017", "languages": [ "Hindi", "English" ], "avatarUrl": "https://example.com/profile.jpg" } 

#### **Request Fields** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|firstName|string|Yes|Min 1 char|User's first name|
|lastName|string|Yes|Min 1 char|User's last name|
|phone|string|No|Optional string|Contactphone number|
|bio|string|No|Optional string|Short user biography|
|avatarUrl|string|No|Valid URL|Profilepicture URL|
|address|string|No|Optional string|Street address|
|city/ state / country|string|No|Optional strings|Geographic location names|
|pinCode|string|No|Optional string|Postal / ZIP code|



#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Onboarding profile updated successfully", "data": { "id": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "name": "Aya Ahmed Abbasi", 

"phone": "9876543250", "address": "Malviya Nagar", "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": "302017", "languages": [ "Hindi", "English" ], "avatarUrl": "https://example.com/profile.jpg" } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body/ validation failure|Zod Validator|
|401|Unauthorized|auth.middleware.ts|
|404|User not found (Calling userId does not exist in<br>User table)<br>i|onboarding.service.ts|
|500|Failed to update onboarding profile|onboarding.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "User not found" } 

#### **Verified Side Effects:** 

Mutates User record in PostgreSQL. 

### **17. Create Vendor Profile** 

#### **Method: POST** 

**Endpoint: /api/onboarding/vendor-profile** 

**Purpose:** Initializes a Vendor Profile draft for a user seeking to list tours or operate as a vendor. Verifies that no prior vendor profile exists for the user and establishes an initial verificationStatus of DRAFT. 

**Authentication:** Required (Bearer Token) **Authorization / Role:** Any Authenticated User **Middleware:** authMiddleware 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) Content-Type: application/json (Required) 

**Path Parameters** 

None 

**Query Parameters** 

None 

#### **Request Body** 

{ "vendorType": "TREK_LEADER" } 

#### **Request Fields** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|vendorType|enum|Yes|INDIVIDUAL, AGENCY,<br>COMMUNITY|Organizational structure|
|experienceYears|number|Yes|Non-negative integer|Years of professional<br>outdoor experience|
|companyName|string|No|Optional string|Commercial enterprise<br>name|
|website|string|No|Valid URL|Business website|
|bio|string|No|Optional string|Vendor agencybiography|



#### **Success Response (HTTP 201)** 

{ "statusCode": 201, "success": true, "message": "Vendor profile created successfully", "data": { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "vendorType": "TREK_LEADER", "verificationStatus": "DRAFT" } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body|Zod Validator|
|401|Unauthorized<br>i|auth.middleware.ts|
|409|Vendor profile already exists (User already has an<br>existingVendorProfile record)<br>i|onboarding.service.ts|
|500|Failed to create vendorprofile|onboarding.controller.ts|



#### **Error Response Examples:** 

Status Code: 409 

{ "statusCode": 409, "success": false, "message": "Vendor profile already exists" } 

#### **Verified Side Effects:** 

Inserts new VendorProfile record in PostgreSQL. 

### **18. Update Vendor Eligibility** 

**Method: PATCH** 

**Endpoint: /api/onboarding/vendor-profile/eligibility** 

**Purpose:** Updates identity verification and legal compliance information for a vendor profile (ID proof, address proof, emergency contacts, and terms agreement). 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** Any Authenticated User 

**Middleware:** authMiddleware 

**Headers:** 

**Authorization:** Bearer <accessToken> (Required) Content-Type: application/json (Required) 

**Path Parameters** 

None 

#### **Query Parameters** 

None 

#### **Request Body** 

{ "isAgeEligible": true, "hasRequiredExperience": true, "hasFirstAidCertification": true, "hasSmartphoneAndWhatsApp": true, "agreesToInsuranceTerms": true, "agreesToSafetyStandards": true } 

#### **Request Fields** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|isAgeEligible|boolean|Yes|Boolean|Confirms applicant<br>meets the required age<br>eligibility|
|hasRequiredExperienc<br>e|boolean|Yes|Boolean|Confirms applicant has<br>the required<br>trekking/guiding<br>experience|
|hasFirstAidCertificatio<br>n|boolean|Yes|Boolean|Confirms applicant has<br>first-aid certification|
|hasSmartphoneAndWh<br>atsApp|boolean|Yes|Boolean|Confirms access to a<br>smartphone and<br>WhatsApp|
|agreesToInsuranceTer<br>ms|boolean|Yes|Boolean|Confirms agreement to<br>insurance terms|
|agreesToSafetyStandar<br>ds|boolean|Yes|Boolean|Confirms agreement to<br>platform safety<br>standards|



#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor eligibility updated successfully", "data": { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "isAgeEligible": true, "hasRequiredExperience": true, "hasFirstAidCertification": true, "hasSmartphoneAndWhatsApp": true, "agreesToInsuranceTerms": true, "agreesToSafetyStandards": true } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body|Zod Validator|
|401|Unauthorized|auth.middleware.ts|



|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|404|Vendor profile not found (Vendor profile draft<br>does not exist for callinguser)|onboarding.service.ts|
|500|Failed to update vendor eligibility|onboarding.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor profile not found" } 

#### **Verified Side Effects:** 

Mutates VendorProfile compliance and proof columns in PostgreSQL. 

### **19. Update Vendor Expertise** 

**Method: PATCH** 

**Endpoint: /api/onboarding/vendor-profile/expertise** 

**Purpose:** Updates professional specializations, spoken languages, operational mountain regions, and primary guiding role on a vendor profile. 

**Authentication:** Required (Bearer Token) **Authorization / Role:** Any Authenticated User **Middleware:** authMiddleware 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) Content-Type: application/json (Required) 

**Path Parameters** 

None 

**Query Parameters** 

None 

#### **Request Body** 

{ "experienceYears": 5, "treksLed": 20, "regionsWorkedIn": [ "Uttarakhand", "Himachal Pradesh", "Kashmir" ] } 

#### **Request Fields** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|experienceYears|integer|Yes|>= 0|Total years of<br>professional<br>trekking/guiding<br>experience|
|treksLed|integer|Yes|>= 0|Total number of treks<br>led|
|regionsWorkedIn|string[]|Yes|Array of strings|Mountain regions<br>where the vendor has|



|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|||||worked|



#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor expertise updated successfully", "data": { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "experienceYears": 5, "treksLed": 20, "regionsWorkedIn": [ "Uttarakhand", "Himachal Pradesh", "Kashmir" ] } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body|Zod Validator|
|401|Unauthorized<br>i|auth.middleware.ts|
|404|Vendorprofile not found|onboarding.service.ts|
|500|Failed to update vendor expertise|onboarding.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor profile not found" } 

#### **Verified Side Effects:** 

Mutates VendorProfile array columns in database. 

### **20. Add User Experience** 

#### **Method: POST** 

#### **Endpoint: /api/onboarding/experiences** 

**Purpose:** Appends a historical trekking experience, expedition leadership, or guiding employment record to the applicant's profile. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** Any Authenticated User 

**Middleware:** authMiddleware 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) Content-Type: application/json (Required) 

**Path Parameters** 

None 

#### **Query Parameters** 

#### None 

#### **Request Body** 

{ "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ] } 

#### **Request Fields** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|description|string|Yes|Min 1 char|Description of the<br>trekking or guiding<br>experience|
|imageUrls|string[]|Yes|Array of valid URLs|Images supporting the<br>experience record|



#### **Success Response (HTTP 201)** 

{ "statusCode": 201, "success": true, "message": "Experience added successfully", "data": { "id": "01a0f110-223d-7f72-a3ed-2707ed7d8b0e", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ], "verificationStatus": "PENDING" } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body|Zod Validator|
|401|Unauthorized<br>i    i|auth.middleware.ts|
|404|Vendor profile not found (Vendor profile must be<br>initialized first)|onboarding.service.ts|
|500|Failed to add experience|onboarding.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor profile not found" } 

#### **Verified Side Effects:** 

Inserts new UserExperience record into PostgreSQL. 

### **21. Add Vendor Certification** 

**Method: POST** 

**Endpoint: /api/onboarding/certifications** 

**Purpose:** Appends professional mountaineering, wilderness first aid, or avalanche safety certification credentials to the vendor profile. 

**Authentication:** Required (Bearer Token) **Authorization / Role:** Any Authenticated User **Middleware:** authMiddleware 

**Headers:** 

**Authorization:** Bearer <accessToken> (Required) Content-Type: application/json (Required) **Path Parameters** None **Query Parameters** None 

#### **Request Body** 

{ "title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", "certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z" } 

#### **Request Fields** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|title|string|Yes|Min 1 char|Certification or course<br>title|
|issuingOrganization|string|Yes|Min 1 char|Accredited institute or<br>authority|
|certificateNumber|string|Yes|Min 1 char|Certificate or<br>credential number|
|certificateUrl|string|Yes|Valid URL|Uploaded certificate<br>file URL|
|issuedAt|string|Yes|Valid ISO Date/Date-<br>Time|Date the certificate<br>was issued|
|expiresAt|string|No|Valid ISO Date/Date-<br>Time|Certificate expiration<br>date, if applicable|



#### **Success Response (HTTP 201)** 

{ "statusCode": 201, "success": true, "message": "Certification added successfully", "data": { "id": "01a0f111-836c-7ca7-a11f-f54152ee0b43", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", 

"certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z", "verificationStatus": "PENDING" } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body|Zod Validator|
|401|Unauthorized<br>i|auth.middleware.ts|
|404|Vendorprofile not found<br>i|onboarding.service.ts|
|500|Failed to add certification|onboarding.controller.ts|



#### **Error Response Examples:** 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor profile not found" } 

#### **Verified Side Effects:** 

Inserts new UserCertification record into PostgreSQL. 

### **22. Submit Vendor Profile for Admin Review** 

#### **Method: POST** 

#### **Endpoint: /api/onboarding/submit** 

**Purpose:** Finalizes the vendor onboarding flow by submitting the completed draft profile for administrative review. Transitions the profile status from DRAFT $\rightarrow$ PENDING. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** Any Authenticated User 

**Middleware:** authMiddleware 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

#### **Path Parameters** 

None 

#### **Query Parameters** 

None 

#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor profile submitted successfully", "data": { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "verificationStatus": "PENDING", "submittedAt": "2026-09-30T06:48:27.209Z" 

} } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Vendor profile already submitted (Profile<br>verificationStatus === "PENDING")<br>i   i|onboarding.service.ts|
|400|Vendor profile already approved (Profile<br>verificationStatus === "APPROVED")|onboarding.service.ts|
|401|Unauthorized<br>i    i|auth.middleware.ts|
|404|Vendor profile not found (No profile exists for<br>caller)<br>i|onboarding.service.ts|
|500|Failed to submit vendorprofile|onboarding.controller.ts|



**Error Response Examples:** 

Status Code: 400 

{ "statusCode": 400, "success": false, "message": "Vendor profile already submitted" } 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor profile not found" } 

**Verified Side Effects:** 

Mutates VendorProfile.verificationStatus = "PENDING" in database. 

## **Section 5: Admin Vendor APIs** 

Mounted Base Path: /api/admin (via adminVendorRoutes in 

<mark>src/routes/admin-vendor.route.ts</mark> 

) 

### **23. Get Pending Vendor Applications** 

**Method: GET** 

**Endpoint: /api/admin/vendors/pending** 

**Purpose:** Retrieves a list of all vendor onboarding profiles currently awaiting administrative review and KYC verification (verificationStatus === "PENDING"). 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

**Headers: Authorization: Path Parameters** None **Query Parameters** None **Request Body** 

**Authorization:** Bearer <accessToken> (Required) 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Pending vendor applications fetched successfully", "data": [ { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "vendorType": "TREK_LEADER", "verificationStatus": "PENDING", "submittedAt": "2026-09-30T06:48:27.209Z", "user": { "name": "Aya Ahmed Abbasi", "email": "itseditz786@gmail.com", "avatarUrl": "https://example.com/profile.jpg", "city": "Jaipur", "state": "Rajasthan" } } ] } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|401|Unauthorized - Missing token / Unauthorized -<br>Invalid or expired token<br>f|auth.middleware.ts|
|403|Forbidden - Insufficient permissions (User role is<br>not ADMIN)|auth.middleware.ts|
|500|Failed to fetchpendingvendor applications|admin-vendor.controller.ts|



#### **Error Response Examples:** 

Status Code: 403 

{ "statusCode": 403, "success": false, "message": "Forbidden - Insufficient permissions" } 

#### **Verified Side Effects:** 

Read-only database query. 

### **24. Get Vendor Application Details** 

**Method: GET** 

**Endpoint: /api/admin/vendors/{userId}** 

**Purpose:** Fetches the comprehensive KYC verification dossier for a specific applicant, including uploaded identity proofs, address documents, emergency contacts, past experience history, and mountaineering certifications. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

**Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|userId|string|Yes|Target applicant's User ID|



#### **Query Parameters** 

None 

#### **Request Body** 

None 

**Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor application fetched successfully", "data": { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "vendorType": "TREK_LEADER", "experienceYears": 5, "treksLed": 20, "regionsWorkedIn": [ "Uttarakhand", "Himachal Pradesh", "Kashmir" ], "isAgeEligible": true, "hasRequiredExperience": true, "hasFirstAidCertification": true, "hasSmartphoneAndWhatsApp": true, "agreesToInsuranceTerms": true, "agreesToSafetyStandards": true, "verificationStatus": "PENDING", "submittedAt": "2026-09-30T06:48:27.209Z", "user": { "name": "Aya Ahmed Abbasi", "email": "itseditz786@gmail.com", "phone": "9876543250", "avatarUrl": "https://example.com/profile.jpg", "address": "Malviya Nagar", "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": "302017", "languages": [ "Hindi", "English" ], "userExperiences": [ { "id": "01a0d3ab-43ab-7e07-acde-7bb57b58ff5e", "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ], "verificationStatus": "PENDING" }, 

{ "id": "01a0f110-223d-7f72-a3ed-2707ed7d8b0e", "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ], "verificationStatus": "PENDING" } ], "userCertifications": [ { "id": "01a0d3ab-a0e0-7d2c-bc11-e1c643b6e627", "title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", "certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z", "verificationStatus": "APPROVED" }, { 

"id": "01a0f111-836c-7ca7-a11f-f54152ee0b43", 

"title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", "certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z", "verificationStatus": "PENDING" } ] } } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|401|Unauthorized<br>f|auth.middleware.ts|
|403|Forbidden - Insufficientpermissions<br>i|auth.middleware.ts|
|404|Vendor application not found (No VendorProfile<br>exists for specified userId)|admin-vendor.service.ts|
|500|Failed to fetch vendor application|admin-vendor.controller.ts|



#### **Error Response Examples:** 

#### Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor application not found" } 

**Verified Side Effects:** 

Read-only database query. 

### **25. Approve Vendor Application** 

#### **Method: PATCH** 

#### **Endpoint: /api/admin/vendors/{userId}/approve** 

**Purpose:** Approves a pending vendor application. Updates the vendor profile verificationStatus to APPROVED, clears any previous rejection reasons, and upgrades the user's platform role from USER to VENDOR in an atomic database transaction. 

**Authentication:** Required (Bearer Token) 

**Authorization / Role:** ADMIN 

**Middleware:** authMiddleware, requireRole("ADMIN") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|userId|string|Yes|Target applicant's User ID|



#### **Query Parameters** 

None 

#### **Request Body** 

None 

#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor application approved successfully", "data": { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "verificationStatus": "APPROVED", "verifiedAt": "2026-09-30T06:54:41.393Z", "rejectionReason": null } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Only pending vendor applications can be<br>approved(Application status is not PENDING)|admin-vendor.service.ts|
|401|Unauthorized|auth.middleware.ts|
|403|Forbidden - Insufficientpermissions|auth.middleware.ts|
|404|Vendor application not found (User has no<br>vendorprofile)|admin-vendor.service.ts|
|500|Failed to approve vendor application|admin-vendor.controller.ts|



#### **Error Response Examples:** 

#### Status Code: 400 

{ "statusCode": 400, "success": false, "message": "Only pending vendor applications can be approved" } 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor application not found" } 

#### **Verified Side Effects:** 

Mutates VendorProfile.verificationStatus to APPROVED. 

Promotes User.role to VENDOR in PostgreSQL. 

### **26. Reject Vendor Application** 

**Method: PATCH** 

**Endpoint: /api/admin/vendors/{userId}/reject** 

**Purpose:** Rejects a pending vendor application with a mandatory written justification explaining why the verification failed. Updates verificationStatus to REJECTED and records the rejection reason. 

**Authentication:** Required (Bearer Token) **Authorization / Role:** ADMIN **Middleware:** authMiddleware, requireRole("ADMIN") 

#### **Headers:** 

**Authorization:** Bearer <accessToken> (Required) 

Content-Type: application/json (Required) 

#### **Path Parameters** 

|**Parameter**|**Type**|**Required**|**Description**|
|---|---|---|---|
|userId|string|Yes|Target applicant's User ID|



#### **Query Parameters** 

None 

#### **Request Body** 

{ "rejectionReason": "Uploaded ID proof document is expired and address proof does not match applicant name." } 

#### **Request Fields** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|rejectionReason|string|Yes|Min 1 char|Detailed justification for the<br>application rejection|



#### **Success Response (HTTP 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor application rejected successfully", "data": { "id": "01a0f10a-6dee-765a-bc48-6bf9813c48ab", "userId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "verificationStatus": "REJECTED", "verifiedAt": null, "rejectionReason": "Uploaded ID proof document is expired and address proof does not match applicant name." } } 

#### **Error Responses & Conditions** 

|**Status Code**|**Error Message / Condition**|**Source Layer**|
|---|---|---|
|400|Invalid request body/ missingrejectionReason|Zod Validator|
|400|Only pending vendor applications can be<br>rejected(Application status is not PENDING)|admin-vendor.service.ts|
|401|Unauthorized<br>f|auth.middleware.ts|
|403|Forbidden - Insufficientpermissions|auth.middleware.ts|
|404|Vendor application not found|admin-vendor.service.ts|
|500|Failed to reject vendor application|admin-vendor.controller.ts|



#### **Error Response Examples:** 

Status Code: 400 

{ "statusCode": 400, "success": false, "message": "Only pending vendor applications can be rejected" } 

Status Code: 404 

{ "statusCode": 404, "success": false, "message": "Vendor application not found" } 

#### **Verified Side Effects:** 

Mutates VendorProfile.verificationStatus to REJECTED and records rejectionReason in PostgreSQL. 

(Continuing immediately with Part 2: Team APIs, Package APIs, Booking APIs, Payment APIs, Review APIs, Vendor APIs, Root API, and the Final Coverage Verification Table...) 

9:47 AM 

give all this in document form 

9:51 AM 

Part 2: Complete Backend API Specification & Verification 

## **Section 6: Team APIs (/api/team)** 

**Mount Point:** /api/team in 

<mark>src/app.ts</mark> **Router Source:** <mark>src/routes/team.route.ts</mark> 

**Controller Source:** <mark>src/controllers/team.controller.ts</mark> 

#### **Service Source:** 

<mark>src/services/team.service.ts</mark> 

### **27. POST /api/team/** 

**Purpose:** Creates a new agency or operations team owned by the authenticated vendor. Initializes the team entity and automatically assigns the creator as an ADMIN member of the team. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (requireRole("VENDOR")). 

**Middleware:** authMiddleware, requireRole("VENDOR"), validateBody(createTeamValidator). **Headers:** Authorization: Bearer <accessToken>, Content-Type: application/json. **Request Body Schema (createTeamValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|name|string|Yes|Min 2 characters|Name of the<br>team/organization|
|description|string|No|Optional string|Detailed description of<br>the team|
|logoUrl|string|No|Valid URL|Team logo image URL|
|city|string|No|Optional string|Primary operating city|
|state|string|No|Optional string|Primary operating state|
|country|string|No|Optional string|Primary operating<br>country|



{ "name": "Himalayan Ascents", "description": "A team of experienced trekking professionals.", "logoUrl": "https://example.com/team-logo.jpg", "city": "Dehradun", "state": "Uttarakhand", "country": "India" } 

#### **Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Team created successfully", "data": { "id": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "name": "trec titans", "description": "A team of experienced trekking professionals.", "logoUrl": "https://example.com/team-logo.jpg", "createdByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "city": "Dehradun", "state": "Uttarakhand", "country": "India", "createdAt": "2026-09-30T07:19:18.044Z", "updatedAt": "2026-09-30T07:19:18.044Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Request validation failed(invalid email/slug)|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: User is not a VENDOR|
|409|Team with this slugalreadyexists|
|500|Internal server error|



{ "statusCode": 409, "success": false, "message": "Team slug already in use. Please choose another slug." } 

### **28. GET /api/team/vendors/search** 

**Purpose:** Searches for verified active vendors to invite to a team by matching names or email addresses. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (requireRole("VENDOR")). 

**Middleware:** authMiddleware, requireRole("VENDOR"). 

#### **Query Parameters:** 

|**Parameter**|**Type**|**Required**|**Constraints**|**Default**|**Description**|
|---|---|---|---|---|---|
|q|string|Yes|Min 2 characters|None|Search query string<br>(email or name)|



#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Vendors fetched successfully", "data": [ { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "email": "ayaanah0786@gmail.com", "avatarUrl": "https://example.com/profile.jpg", "city": "Jaipur", "state": "Rajasthan", "vendorType": "TREK_LEADER", "experienceYears": 5 } ] } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Searchquery'q' must be at least 2 characters|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: User is not a VENDOR|
|500|Internal server error|



### **29. POST /api/team/{teamId}/invitations** 

**Purpose:** Sends an invitation to an existing platform vendor to join a specific team. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (must be team owner or team admin). 

**Middleware:** authMiddleware, requireRole("VENDOR"), validateBody(sendTeamInvitationValidator). 

**Path Parameters:** teamId (UUID, required). 

#### **Request Body Schema (sendTeamInvitationValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|invitedUserId|string|Yes|Valid user ID|Platform user ID of the<br>vendor to invite|



{ "invitedUserId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b" } 

#### **Success Response (Status Code 201)** 

{ "statusCode": 201, 

"success": true, "message": "Team invitation sent successfully", "data": { "id": "01a0f133-e3b3-7235-935b-8e1cc77b1119", "teamId": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "invitedUserId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "email": "itseditz786@gmail.com", "invitedByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "status": "PENDING", "expiresAt": null, "createdAt": "2026-09-30T07:25:04.822Z", "updatedAt": "2026-09-30T07:25:04.822Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Invalidpayload / user is alreadya member|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: Onlyteam admins or owner can invite members|
|404|Team or vendor not found|
|409|Pendinginvitation alreadyexists for this vendor|
|500|Internal server error|



### **30. POST /api/team/{teamId}/onboarding-invitations** 

**Purpose:** Invites an external vendor/guide via email who does not yet have a platform account to onboard directly into the team. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (team owner or admin). 

**Path Parameters:** teamId (UUID, required). 

#### **Request Body Schema (sendOnboardingInvitationValidator)** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|email|string|Yes|Valid email string|Invitee email address|
|role|string|No|Enum: MEMBER,ADMIN|Default: MEMBER|



{ "email": "someone@gmail.com" } 

#### **Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Vendor onboarding invitation sent successfully", "data": { "id": "01a0f138-7c40-7f0e-bebf-cc31a519fe92", "teamId": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "invitedUserId": "01a07f06-7bb7-73ce-81d1-a31d931fb753", "email": "ayaanah776@gmail.com", "invitedByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "status": "PENDING", "expiresAt": null, "createdAt": "2026-09-30T07:30:06.024Z", "updatedAt": "2026-09-30T07:30:06.024Z" 

} } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Invalid email format|
|403|Forbidden: Not authorized to manage team|
|404|Team not found|
|409|An active onboardinginvitation for this email alreadyexists|
|500|Internal server error|



### **31. GET /api/team/invitations/me** 

**Purpose:** Fetches all pending and historical team invitations received by the currently authenticated user. **Authentication:** Required (authMiddleware). 

**Authorization:** Authenticated user. 

**Middleware:** authMiddleware. 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team invitations fetched successfully", "data": [ { "id": "01a0f133-e3b3-7235-935b-8e1cc77b1119", "status": "PENDING", "createdAt": "2026-09-30T07:25:04.822Z", "expiresAt": null, "team": { "id": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "name": "trec titans", "logoUrl": "https://example.com/team-logo.jpg", "city": "Dehradun", "state": "Uttarakhand", "country": "India" }, "invitedBy": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "email": "ayaanah0786@gmail.com" } } ] } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized: Missingor invalid token|
|500|Internal server error|



### **32. PATCH /api/team/invitations/{invitationId}/accept** 

**Purpose:** Accepts a pending team invitation, creating an active team membership for the user and updating invitation status to ACCEPTED. 

**Authentication:** Required (authMiddleware). 

**Authorization:** Invitee only (inviteeId === user.id). 

**Path Parameters:** invitationId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team invitation accepted successfully", "data": { "id": "01a0f133-e3b3-7235-935b-8e1cc77b1119", "teamId": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "invitedUserId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "email": "itseditz786@gmail.com", "invitedByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "status": "ACCEPTED", "expiresAt": null, "createdAt": "2026-09-30T07:25:04.822Z", "updatedAt": "2026-09-30T07:35:33.953Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: Invitation is not addressed toyou|
|404|Invitation not found|
|409|Invitation is no longer in PENDING status|
|500|Internal server error|



### **33. PATCH /api/team/invitations/{invitationId}/reject** 

**Purpose:** Rejects a pending team invitation, marking its status as REJECTED. 

**Authentication:** Required (authMiddleware). **Authorization:** Invitee only (inviteeId === user.id). **Path Parameters:** invitationId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team invitation rejected successfully", "data": { "id": "01a0f133-e3b3-7235-935b-8e1cc77b1119", "teamId": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "invitedUserId": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "email": "itseditz786@gmail.com", "invitedByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "status": "REJECTED", "expiresAt": null, "createdAt": "2026-09-30T07:25:04.822Z", "updatedAt": "2026-09-30T07:35:33.953Z" } } 

#### **Error Responses** 

**Status Code Error Message / Condition** 401 Unauthorized: Missing or invalid token 

|**Status Code**|**Error Message / Condition**|
|---|---|
|403|Forbidden: Invitation is not addressed toyou|
|404|Invitation not found|
|409|Invitation is not in PENDING status|
|500|Internal server error|



### **34. GET /api/team/{teamId}/members** 

**Purpose:** Retrieves the list of all active members belonging to a team, including roles and profile details. **Authentication:** Required (authMiddleware). 

**Authorization:** Team members or owner. 

**Path Parameters:** teamId (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team members fetched successfully", "data": [ { "id": "01a0f12e-99e6-7fd4-b6db-e8c23537ddcb", "role": "OWNER", "status": "ACTIVE", "joinedAt": "2026-09-30T07:19:18.246Z", "user": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "email": "ayaanah0786@gmail.com", "avatarUrl": "https://example.com/profile.jpg", "city": "Jaipur", "state": "Rajasthan", "vendorProfile": { "vendorType": "TREK_LEADER", "experienceYears": 5 } } }, { "id": "01a0f13d-7c3f-7ad7-8f77-978417acec8d", "role": "MEMBER", "status": "ACTIVE", "joinedAt": "2026-09-30T07:35:33.695Z", "user": { "id": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "name": "Aya Ahmed Abbasi", "email": "itseditz786@gmail.com", "avatarUrl": "https://example.com/profile.jpg", "city": "Jaipur", "state": "Rajasthan", "vendorProfile": { "vendorType": "TREK_LEADER", "experienceYears": 5 } } } 

] } 

**Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: Not a member of this team|
|404|Team not found|
|500|Internal server error|



### **35. GET /api/team/{teamId}** 

**Purpose:** Retrieves the internal management details and configuration for a specific team. **Authentication:** Required (authMiddleware). **Authorization:** Team members or owner. **Path Parameters:** teamId (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team details fetched successfully", "data": { "id": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "name": "trec titans", "description": "A team of experienced trekking professionals.", "logoUrl": "https://example.com/team-logo.jpg", "city": "Dehradun", "state": "Uttarakhand", "country": "India", "createdByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "createdAt": "2026-09-30T07:19:18.044Z", "updatedAt": "2026-09-30T07:19:18.044Z", "createdBy": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "_count": { "members": 2, "packages": 0 } } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: Not authorized to view team details|
|404|Team not found|
|500|Internal server error|



### **36. PATCH /api/team/{teamId}** 

**Purpose:** Updates organizational details, contact information, and metadata for a team. **Authentication:** Required (authMiddleware). 

**Authorization:** Team owner or team ADMIN. 

**Path Parameters:** teamId (UUID, required). 

#### **Request Body Schema (updateTeamValidator)** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|name|string|No|Min 2, max 100 characters|Updated team name|
|description|string|No|Max 1000 characters|Updated description|
|contactEmail|string|No|Valid email format|Updated contact email|
|contactPhone|string|No|Validphone string|Updated contactphone|
|websiteUrl|string|No|Valid URL|Updated website link|
|locationId|string|No|Valid UUID|Updated location ID|



{ "name": "trec titans", "description": "A team of experienced trekking professionals.", "logoUrl": "https://example.com/team-logo.jpg", "city": "Dehradun", "state": "Uttarakhand", "country": "India" } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team updated successfully", "data": { "id": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "name": "trec titans", "description": "A team of experienced trekking professionals.", "logoUrl": "https://example.com/team-logo.jpg", "city": "Dehradun", "state": "Uttarakhand", "country": "India", "createdByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "createdAt": "2026-09-30T07:19:18.044Z", "updatedAt": "2026-09-30T07:51:15.148Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: Onlyteam admin or owner can modifyteam details|
|404|Team not found|
|500|Internal server error|



### **37. GET /api/team/{teamId}/public-profile** 

**Purpose:** Public endpoint retrieving a team's public-facing profile, active packages, ratings, and social metrics. **Authentication:** None (Public). 

**Path Parameters:** teamId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, 

"message": "Team profile fetched successfully", "data": { "id": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "name": "trec titans", "description": "A team of experienced trekking professionals.", "logoUrl": "https://example.com/team-logo.jpg", "city": "Dehradun", "state": "Uttarakhand", "country": "India", "owner": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "members": [ { "id": "01a0f12e-99e6-7fd4-b6db-e8c23537ddcb", "role": "OWNER", "user": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg", "city": "Jaipur", "state": "Rajasthan", "country": "India", "userExperiences": [ { "id": "01a07f65-3628-7140-bc65-88181c103b33", "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ], "trekName": null, "difficulty": null, "roleDuringTrek": null, "completedAt": null, "duration": null, "altitude": null, "proofUrl": null, "verificationStatus": "APPROVED" }, { "id": "01a0da0b-0d61-7462-9203-e827e5d86136", "description": "Completed Kedarkantha Winter Trek trek through the platform.", "imageUrls": [], "trekName": "Kedarkantha Winter Trek", "difficulty": "MODERATE", "roleDuringTrek": "TREK_LEADER", "completedAt": "2026-08-15T00:00:00.000Z", "duration": 6, "altitude": 3810, "proofUrl": null, "verificationStatus": "APPROVED" } ], 

"userCertifications": [ { "id": "01a07f70-272e-748c-ba3d-d5f4e0bbada7", "title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", "certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z", "verificationStatus": "APPROVED" } ] } }, { "id": "01a0f13d-7c3f-7ad7-8f77-978417acec8d", "role": "MEMBER", "user": { "id": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "name": "Aya Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg", "city": "Jaipur", "state": "Rajasthan", "country": "India", "userExperiences": [ { "id": "01a0d3ab-43ab-7e07-acde-7bb57b58ff5e", "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ], "trekName": null, "difficulty": null, "roleDuringTrek": null, "completedAt": null, "duration": null, "altitude": null, "proofUrl": null, "verificationStatus": "APPROVED" }, { "id": "01a0f110-223d-7f72-a3ed-2707ed7d8b0e", "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ], "trekName": null, "difficulty": null, "roleDuringTrek": null, "completedAt": null, "duration": null, "altitude": null, "proofUrl": null, "verificationStatus": "APPROVED" 

} ], "userCertifications": [ { "id": "01a0d3ab-a0e0-7d2c-bc11-e1c643b6e627", "title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", "certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z", "verificationStatus": "APPROVED" }, { "id": "01a0f111-836c-7ca7-a11f-f54152ee0b43", "title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", "certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z", "verificationStatus": "APPROVED" } ] } } ], "experiences": [], "packages": [], "createdAt": "2026-09-30T07:19:18.044Z" } } 

#### **Error Responses** 

**Status Code Error Message / Condition** 404 Team not found 500 Internal server error 

### **38. GET /api/team/{teamId}/dashboard** 

**Purpose:** Retrieves analytical and operational metrics for a team dashboard (revenue, total bookings, upcoming departures, active packages). 

**Authentication:** Required (authMiddleware). 

**Authorization:** Team members or owner. 

**Path Parameters:** teamId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team dashboard fetched successfully", "data": { "stats": { "totalEarnings": 0, "activeTreks": 0, "pendingBookings": 0, 

"totalTrekkers": 0 }, "revenueTrend": [ { "period": "2026-04", "revenue": 0 }, { "period": "2026-05", "revenue": 0 }, { "period": "2026-06", "revenue": 0 }, { "period": "2026-07", "revenue": 0 }, { "period": "2026-08", "revenue": 0 }, { "period": "2026-09", "revenue": 0 } ], "pendingBookings": [], "activeTreks": [] } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: You are not authorized to view this team's metrics|
|404|Team not found|
|500|Internal server error|



### **39. GET /api/team/{teamId}/bookings** 

**Purpose:** Lists all customer bookings associated with packages published under this team. **Authentication:** Required (authMiddleware). **Authorization:** Team members or owner. 

**Path Parameters:** teamId (UUID, required). 

**Query Parameters:** 

|**Parameter**|**Type**|**Required**|**Constraints**|**Default**|**Description**|
|---|---|---|---|---|---|
|page|integer|No|>= 1|1|Page number|
|limit|integer|No|1 <= limit <= 100|20|Itemsperpage|
|status|string|No|Enum: PENDING,<br>CONFIRMED,<br>CANCELLED,<br>COMPLETED|None|Filter by booking<br>status|
|dateFrom|string|No|ISO Date string|None|Start date filter<br>i|
|dateTo|string|No|ISO Date string|None|End date filter|



#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team bookings fetched successfully", "data": { "bookings": [], "totalBookings": 0, "pendingBookings": 0, "confirmedRevenue": 0, "upcomingTreks": 0, "nextCursor": null, "hasNextPage": false } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: You do not havepermission to view bookings for this team|
|404|Team not found|
|500|Internal server error|



## **Section 7: Package APIs (/api/package)** 

**Mount Point:** /api/package in 

<mark>src/app.ts</mark> **Router Source:** <mark>src/routes/package.route.ts</mark> 

#### **Router Source:** 

#### **Controller Source:** 

<mark>src/controllers/package.controller.ts</mark> 

#### **Service Source:** 

<mark>src/services/package.service.ts</mark> 

### **40. POST /api/package/** 

**Purpose:** Initiates creation of a commercial vendor package based on an existing MasterTrek. Creates the core package record in DRAFT status. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (requireRole("VENDOR")). 

**Middleware:** authMiddleware, requireRole("VENDOR"), validateBody(createPackageValidator). 

#### **Request Body Schema (createPackageValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|masterTrekId|string|Yes|Valid UUID|ID of the master trek<br>being commercialized|



{ "masterTrekId": "550e8400-e29b-41d4-a716-446655440000" } 

**Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Package created successfully", "data": { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "locationId": "ULB:248211", "difficulty": "MODERATE", "distanceKm": 20, "createdByUserId": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "teamId": null, "masterTrekId": "01a0d323-4e94-7cfb-a2fc-158cdcda5277", "routeId": null, "galleryImages": [], "scheduleType": "FIXED", "inclusions": [], "exclusions": [], "packingList": [], "fitnessAndExperienceRequirement": null, "title": "Shimla", "description": "A complete description of the Kedarkantha trek.", "visibility": "PUBLIC", "status": "DRAFT", "durationDays": 6, "meetingPoint": null, "instructions": null, "createdAt": "2026-09-30T08:17:01.878Z", "updatedAt": "2026-09-30T08:17:01.878Z", "location": { "id": "ULB:248211", "name": "Dharamshala", "type": "URBAN_LOCAL_BODY" } } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Request validation failed(e.g. minAge > maxAge)|
|401|Unauthorized: Missingor invalid token<br>i        i|
|403|Forbidden: User is not a verified VENDOR or not a member of the specified<br>team|
|404|Master trek not found|
|500|Internal server error|



### **41. PATCH /api/package/{id}/basics** 

**Purpose:** Updates foundational metadata, title, duration, age limits, and meeting details for an existing package. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner or team admin). **Path Parameters:** id (UUID, required). 

#### **Request Body Schema (updatePackageValidator)** 

{ "title": "Shimla", 

"description": "A scenic winter trek through the Himalayas.", 

"locationId": "STATE:5", "difficulty": "MODERATE", "durationDays": 6, "distanceKm": 20, "galleryImages": [ "https://example.com/kedarkantha-1.jpg", "https://example.com/kedarkantha-2.jpg" ] } { "title": "Hampta Pass & Chandratal Adventure (All Inclusive)", "meetingPoint": "Old Manali Club House", "maxAge": 60 } 

#### **Success Response (Status Code 200)** 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error|
|401|Unauthorized|
|403|Forbidden: Not authorized to edit thispackage|
|404|Package not found|
|500|Internal server error|



### **42. GET /api/package/{id}/routes** 

**Purpose: Fetches routes available for the specified package. Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). **Path Parameters:** id (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package routes fetched successfully", "data": [ { "id": "01a0d325-0b32-7d2a-8b72-b14a63fd0640", "name": "Standard Route", "description": "Most commonly used route for this trek.", "distanceKm": 20, "difficulty": "MODERATE", "elevationGain": 1200, "ascentTime": "7 hours", "descentTime": "5 hours", "startPoint": "Sankri", "endPoint": "Kedarkantha Summit", "isPopular": true } ] } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error|
|401|Unauthorized|



|**Status Code**|**Error Message / Condition**|
|---|---|
|403|Forbidden|
|404|Package not found|
|500|Internal server error|



### **43. POST /api/package/{id}/itinerary/{routeId}** 

**Purpose:** Bulk replaces or sets all day-by-day itinerary entries for a specific package route. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required), routeId (UUID, required). 

#### **Request Body Schema (bulkItineraryValidator)** 

{ "days": [ { "dayNumber": 1, "title": "Drive from Manali to Jobra, trek to Chika", "description": "Scenic 2-hour drive followed by a gentle 2-hour ascent through pine forests.", "meals": ["LUNCH", "DINNER"], "accommodation": "Dome Tents at Chika campsite", "distanceKm": 4.0, "startAltitude": 2050, "endAltitude": 3100, "maxAltitude": 3100, "highlights": ["Rani Nallah river crossing", "Pine and birch forests"] }, { "dayNumber": 2, "title": "Chika to Balu Ka Ghera", "description": "Ascent along the riverbed towards the moraine zone.", "meals": ["BREAKFAST", "LUNCH", "DINNER"], "accommodation": "Dome Tents at Balu Ka Ghera", "distanceKm": 8.5, "startAltitude": 3100, "endAltitude": 3700, "maxAltitude": 3700, "highlights": ["Wild alpine flower blooms", "Balu Ka Ghera meadows"] } ] } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package itinerary fetched successfully", "data": { "routeId": "01a0d325-0b32-7d2a-8b72-b14a63fd0640", "routeName": "Standard Route", "days": [ { "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, 

"duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg", "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg" ], "activities": [ { "id": "01a0954c-4353-7009-904d-d20163223ec4", "name": "Camping", "description": "Night camping at Juda Ka Talab", "iconUrl": "https://res.cloudinary.com/demo/image/upload/camping.png" } ] } ] } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Invalid itinerary payload(duplicate daynumbers, non-sequential)|
|401|Unauthorized|
|403|Forbidden|
|404|Package or Route not found|
|500|Internal server error|



### **44. POST /api/package/{id}/itinerary** 

**Purpose: Creates the package itinerary for the specified package using the selected route and day-by-day details. Authentication:** Optional / Public for published packages. **Path Parameters:** id (UUID, required). 

**_Request Body_** { "routeId": "01a0b464-0c2e-76f7-943b-15c39886dd68", "days": [ { "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest to Juda Ka Talab.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg" ] } ] } **Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Package itinerary created successfully", "data": { "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "routeId": "01a0d325-0b32-7d2a-8b72-b14a63fd0640", "days": [ { "id": "01a0f183-9997-7707-b3bf-974f873b5d14", "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest to Juda Ka Talab.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg" ] } ] } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|404|Package not found|
|500|Internal server error|



### **45. PATCH /api/package/{id}/itinerary/{dayId}** 

**Purpose:** Updates attributes of a single itinerary day. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). **Path Parameters:** id (UUID, required), dayId (UUID, required). 

**Request Body Schema (updateItineraryDayValidator)** { "dayNumber": 2, "title": "Bekaltal to Brahmatal", "description": "Trek through alpine forests towards Brahmatal.", "startLocation": "Bekaltal", "endLocation": "Brahmatal", "distanceKm": 7, "duration": "5 hours", "altitude": 3200, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-2.jpg" ] } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, 

"success": true, "message": "Package itinerary day updated successfully", "data": { "id": "01a0f183-9997-7707-b3bf-974f873b5d14", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "dayNumber": 2, "title": "Bekaltal to Brahmatal", "description": "Trek through alpine forests towards Brahmatal.", "startLocation": "Bekaltal", "endLocation": "Brahmatal", "distanceKm": 7, "duration": "5 hours", "altitude": 3200, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-2.jpg" ], "updatedAt": "2026-09-30T08:59:20.358Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error|
|401|Unauthorized|
|403|Forbidden|
|404|Itinerarydaynot found|
|500|Internal server error|



### **46. DELETE /api/package/{id}/itinerary/{dayId}** 

**Purpose:** Removes a single day from a package itinerary. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). **Path Parameters:** id (UUID, required), dayId (UUID, required). **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package itinerary day deleted successfully", "data": { "id": "01a0f183-9997-7707-b3bf-974f873b5d14", "dayNumber": 2 } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized|
|403|Forbidden|
|404|Daynot found|
|500|Internal server error|



### **47. POST /api/package/{id}/itinerary/day** 

**Purpose:** Adds a single new day to an existing package route itinerary. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required). 

#### **Request Body Schema (itineraryDayValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|dayNumber|integer|Yes|>= 1|Day sequence number|
|title|string|Yes|Min 2 characters|Title of the day|
|description|string|Yes|Min 5 characters|Day overview|
|startLocation|string|Yes|String|Starting location for the<br>day|
|endLocation|string|Yes|String|Ending location for the<br>day|
|distanceKm|number|Yes|>= 0|Distance covered in<br>kilometers|
|duration|string|Yes|String|Estimated duration for<br>the day|
|altitude|number|Yes|Number|Altitude in meters|
|imageUrls|string[]|Yes|Array of valid URLs|Images for the itinerary<br>day|



{ "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest to Juda Ka Talab.", 

"startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg" ] } 

#### **Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Package itinerary day added successfully", "data": { "id": "01a0f1ae-6b54-7634-9115-716735d19ec6", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "dayNumber": 1, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest to Juda Ka Talab.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", "altitude": 2780, "imageUrls": [ 

"https://res.cloudinary.com/demo/image/upload/day-1-1.jpg" ], "createdAt": "2026-09-30T09:38:54.970Z", "updatedAt": "2026-09-30T09:38:54.970Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error / dayNumber collision|
|401|Unauthorized|
|403|Forbidden|
|404|Package or Route not found|
|500|Internal server error|



### **48. PATCH /api/package/{id}/inclusions** 

**Purpose:** Configures the detailed list of inclusions and exclusions for a package. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required). 

#### **Request Body Schema (packageInclusionsValidator)** 

{ "inclusions": [ "Accommodation (Tents/Homestays)", "All Meals during the trek", "Qualified Trek Leader" ], "exclusions": [ "Cab fare to Jobra and from Chattru to Manali is not included" ], "packingList": [ "Trekking shoes", "Warm jacket", "Water bottle" ], "fitnessAndExperienceRequirement": "Participants must be able to jog 5 km in 30 minutes. Previous high-altitude experience is recommended but not mandatory." } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package inclusions and requirements updated successfully", "data": { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "inclusions": [ "Accommodation (Tents/Homestays)", "All Meals during the trek", "Qualified Trek Leader" ], "exclusions": [ "Cab fare to Jobra and from Chattru to Manali is not included" ], "packingList": [ "Trekking shoes", 

"Warm jacket", "Water bottle" ], "fitnessAndExperienceRequirement": "Participants must be able to jog 5 km in 30 minutes. Previous high-altitude experience is recommended but not mandatory.", "updatedAt": "2026-09-30T09:49:26.353Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error(emptyarrays or invalid stringelements)|
|401|Unauthorized|
|403|Forbidden|
|404|Package not found|
|500|Internal server error|



### **49. POST /api/package/{id}/schedules** 

**Purpose:** Creates batch departures/schedules for a package, defining departure dates, capacities, base pricing, cutoff limits, and partial payment allowances. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required). 

#### **Request Body Schema (createSchedulesValidator)** 

{ "startDate": "2026-05-03T00:00:00.000Z", "endDate": "2026-05-08T00:00:00.000Z", "bookingStartDate": "2026-03-01T00:00:00.000Z", "bookingEndDate": "2026-05-01T00:00:00.000Z", "price": 16500, "adultPrice": 16500, "childPrice": 12000, "allowPartialPayment": true, "depositType": "PERCENTAGE", "depositValue": 25, "balanceDueDaysBeforeStart": 7, "currency": "INR", "minParticipants": 5, "maxParticipants": 12, "cancellationPolicy": "Free cancellation up to 7 days before departure." } 

#### **Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Package schedule created successfully", "data": { "id": "01a0f1bc-50da-76cc-b903-5283457a73cf", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "startDate": "2026-05-03T00:00:00.000Z", "endDate": "2026-05-08T00:00:00.000Z", "bookingStartDate": "2026-03-01T00:00:00.000Z", "bookingEndDate": "2026-05-01T00:00:00.000Z", "currency": "INR", "minParticipants": 5, 

"maxParticipants": 12, "availableSeats": 12, "status": "DRAFT", "publishedAt": null, "cancelledAt": null, "cancellationReason": null, "createdAt": "2026-09-30T09:54:05.671Z", "updatedAt": "2026-09-30T09:54:05.671Z", "price": 16500, "adultPrice": null, "childPrice": null, "allowPartialPayment": true, "depositType": "PERCENTAGE", "depositValue": 25, "balanceDueDaysBeforeStart": 7, "cancellationPolicy": "Free cancellation up to 7 days before departure." } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Start date must be before end date / start date inpast|
|401|Unauthorized|
|403|Forbidden|
|404|Package not found|
|500|Internal server error|



### **50. GET /api/package/{id}/schedules** 

**Purpose:** Fetches all available and scheduled departures for a specific package with optional date filters and status queries. 

**Authentication:** None / Public. 

**Path Parameters:** id (UUID, required). 

Query Parameters: None 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package schedules fetched successfully", "data": [ { "id": "01a0f1bc-50da-76cc-b903-5283457a73cf", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "startDate": "2026-05-03T00:00:00.000Z", "endDate": "2026-05-08T00:00:00.000Z", "bookingStartDate": "2026-03-01T00:00:00.000Z", "bookingEndDate": "2026-05-01T00:00:00.000Z", "currency": "INR", "minParticipants": 5, "maxParticipants": 12, "availableSeats": 12, "status": "DRAFT", "publishedAt": null, "cancelledAt": null, 

"cancellationReason": null, "createdAt": "2026-09-30T09:54:05.671Z", "updatedAt": "2026-09-30T09:54:05.671Z", "price": 16500, "adultPrice": null, "childPrice": null, "allowPartialPayment": true, "depositType": "PERCENTAGE", "depositValue": 25, "balanceDueDaysBeforeStart": 7, "cancellationPolicy": "Free cancellation up to 7 days before departure.", "displayStatus": "NEW" } ] } 

#### **Error Responses** 

**Status Code Error Message / Condition** 404 Package not found 500 Internal server error 

### **51. PATCH /api/package/{id}/schedule-type** 

**Purpose: Updates the schedule operating model of a package (e.g. FIXED, FLEXIBLE).** 

**Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required). 

#### **Request Body Schema (updateScheduleTypeValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|scheduleType|string|Yes|Enum: FIXED, PARTIAL|Operating scheduling<br>model|



{ "scheduleType": "PARTIAL" } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package schedule type updated successfully", "data": { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "scheduleType": "FIXED", "updatedAt": "2026-09-30T09:59:11.133Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Invalid scheduleType value|
|401|Unauthorized|
|403|Forbidden|
|404|Package not found|
|500|Internal server error|



### **52. PATCH /api/package/{id}/schedules/{scheduleId}/cancel** 

**Purpose:** Cancels a specific departure schedule and records a cancellation reason. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required), scheduleId (UUID, required). 

#### **Request Body Schema (cancelScheduleValidator)** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|reason|string|Yes|Min 5, max 500 characters|Explanation for cancellation|



{ "reason": "Adverse weather warnings from meteorological department for Hampta Pass." } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package schedule cancelled successfully", "data": { "id": "01a0f1bc-50da-76cc-b903-5283457a73cf", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "status": "CANCELLED", "cancelledAt": "2026-09-30T10:24:07.256Z", "cancellationReason": "Trek cancelled due to bad weather conditions.", "updatedAt": "2026-09-30T10:24:07.260Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error|
|401|Unauthorized|
|403|Forbidden|
|404|Schedule not found|
|500|Internal server error|



### **53. POST /api/package/{id}/schedules/bulk-cancel** 

**Purpose:** Cancels multiple departure schedules simultaneously under an emergency or operational constraint. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required). 

#### **Request Body Schema (bulkCancelSchedulesValidator)** 

{ "scheduleIds": [ "sch-9c0b-4ef8-bb6d-6bb9bd380001", "sch-9c0b-4ef8-bb6d-6bb9bd380002" ], "reason": "Trail bridge reconstruction and seasonal pass closure." } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, 

"message": "Package schedules cancelled successfully", "data": { "cancelledCount": 1 } } 

**Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Schedule IDs arraycannot be empty|
|401|Unauthorized|
|403|Forbidden|
|404|Package not found|
|500|Internal server error|



### **54. PATCH /api/package/{id}/schedules/{scheduleId}** 

**Purpose:** Modifies pricing, capacity, cutoff days, or partial payment parameters on an existing open departure schedule. **Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required), scheduleId (UUID, required). 

#### **Request Body Schema (updateScheduleValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|startDate|string|No|Valid ISO date-time|Updated trek start date|
|endDate|string|No|Valid ISO date-time|Updated trek end date|
|bookingStartDate|string|No|Valid ISO date-time|Updated booking<br>opening date|
|bookingEndDate|string|No|Valid ISO date-time|Updated booking<br>closing date|
|price|number|No|> 0|Updated base price|
|adultPrice|number|No|> 0|Updated adult price|
|childPrice|number|No|>= 0|Updated child price|
|allowPartialPayment|boolean|No|Boolean|Whether partial<br>payment is allowed|
|depositType|string|No|String|Deposit calculation<br>type|
|depositValue|number|No|>= 0|Deposit amount or<br>percentage value|
|balanceDueDaysBefor<br>eStart|integer|No|>= 0|Days before start when<br>remaining balance is<br>due|
|currency|string|No|Currency code|Payment currency|
|minParticipants|integer|No|>= 1|Minimum participants<br>required|
|maxParticipants|integer|No|>= minParticipants|Maximum participants<br>allowed|
|cancellationPolicy|string|No|String|Cancellation policy for<br>the schedule|



{ "startDate": "2026-05-10T00:00:00.000Z", 

"endDate": "2026-05-15T00:00:00.000Z", "bookingStartDate": "2026-03-01T00:00:00.000Z", "bookingEndDate": "2026-05-08T00:00:00.000Z", "price": 18000, "adultPrice": 18000, "childPrice": 13000, "allowPartialPayment": false, "depositType": "PERCENTAGE", "depositValue": 25, "balanceDueDaysBeforeStart": 7, "currency": "INR", "minParticipants": 5, "maxParticipants": 15, "cancellationPolicy": "Free cancellation up to 5 days before departure." } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package schedule updated successfully", "data": { "id": "01a0f1bc-50da-76cc-b903-5283457a73cf", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "startDate": "2026-05-10T00:00:00.000Z", "endDate": "2026-05-15T00:00:00.000Z", "bookingStartDate": "2026-03-01T00:00:00.000Z", "bookingEndDate": "2026-05-08T00:00:00.000Z", "currency": "INR", "minParticipants": 5, "maxParticipants": 15, "availableSeats": 12, "status": "CANCELLED", "publishedAt": null, "cancelledAt": "2026-09-30T10:34:49.311Z", "cancellationReason": "Schedules cancelled due to bad weather conditions.", "createdAt": "2026-09-30T09:54:05.671Z", "updatedAt": "2026-09-30T10:43:57.703Z", "price": 18000, "adultPrice": null, "childPrice": null, "allowPartialPayment": false, "depositType": null, "depositValue": null, "balanceDueDaysBeforeStart": null, "cancellationPolicy": "Free cancellation up to 5 days before departure." 

} 

} 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Capacitycannot be lower than existingbooked seats|
|401|Unauthorized|
|403|Forbidden|
|404|Schedule not found|
|500|Internal server error|



### **55. PATCH /api/package/{id}/schedules/{scheduleId}/open** 

**Purpose:** Re-opens a previously paused or cancelled departure schedule for customer bookings. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required), scheduleId (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package schedule opened successfully", "data": { "id": "01a0f1bc-50da-76cc-b903-5283457a73cf", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "status": "OPEN", "publishedAt": "2026-09-30T10:46:28.739Z", "updatedAt": "2026-09-30T10:46:28.755Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Cannot open schedule in thepast|
|401|Unauthorized|
|403|Forbidden|
|404|Schedule not found|
|500|Internal server error|



### **56. PATCH /api/package/{packageId}/schedules/{scheduleId}/complete** 

**Purpose:** Marks a finished departure schedule as COMPLETED. Enables completed booking participants to submit reviews. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (package owner). 

**Path Parameters:** packageId (UUID, required), scheduleId (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package schedule completed successfully", "data": { "schedule": { "id": "01a0f1bc-50da-76cc-b903-5283457a73cf", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "status": "COMPLETED", "startDate": "2026-03-10T00:00:00.000Z", "endDate": "2026-03-15T00:00:00.000Z", "updatedAt": "2026-09-30T12:25:27.970Z" }, "completedBookings": 1, "alreadyCompleted": false } } 

**Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Cannot complete schedule before its end date|
|401|Unauthorized|
|403|Forbidden|
|404|Schedule not found|
|500|Internal server error|



### **57. POST /api/package/{id}/publish** 

**Purpose:** Validates and publishes a draft package to the marketplace. Requires complete basics, at least one route, full itinerary days, inclusions/exclusions, and at least one upcoming departure schedule. **Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). 

**Path Parameters:** id (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package published successfully", "data": { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "title": "Shimla", "status": "PUBLISHED", "updatedAt": "2026-09-30T11:19:28.828Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Package is incomplete: missing route, itinerary, inclusions, or future<br>schedules|
|401|Unauthorized|
|403|Forbidden: Only package owner canpublish|
|404|Package not found|
|500|Internal server error|



### **58. PATCH /api/package/{id}/deactivate** 

**Purpose:** Unpublishes an active package from the public search index, setting its status back to INACTIVE. 

**Authentication:** Required (authMiddleware). **Authorization:** VENDOR role (package owner). **Path Parameters:** id (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package deactivated successfully", "data": { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "title": "Shimla", "status": "INACTIVE", "updatedAt": "2026-09-30T11:22:15.320Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized|
|403|Forbidden|
|404|Package not found|
|500|Internal server error|



### **59. GET /api/package/my-activities** 

**Purpose:** Lists all commercial packages created by the authenticated vendor or associated with their teams. **Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role. 

#### **Query Parameters:** 

|Parameter|Type|Required|Constraints|Default|
|---|---|---|---|---|
|page|integer|No|>= 1|1|
|limit|integer|No|1 <= limit <= 50|10|
|status|string|No|DRAFT, PUBLISHED,<br>INACTIVE|None|



#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "My activities fetched successfully", "data": { "items": [ { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "title": "Shimla", "status": "INACTIVE", "durationDays": 6, "nextSchedule": null } ], "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 } } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized: Missingor invalid token|
|403|Forbidden: User is not a VENDOR|
|500|Internal server error|



### **60. GET /api/package/search** 

**Purpose:** Advanced public search and filtering endpoint for catalog discovery. Supports full-text search, location filtering, budget brackets, difficulty level, departure dates, and sorting options. 

**Authentication:** None (Public). 

#### **Query Parameters:** 

|Parameter|Type|Required|Constraints|Default|Description|
|---|---|---|---|---|---|
|search|string|No|String|None|Search text|
|difficulty|string|No|EASY, MODERATE,<br>DIFFICULT, PRO|None|Difficulty filter|
|startDate|string (date-time)|No|Valid ISO date-<br>time|None|Departure start<br>date filter|
|endDate|string (date-time)|No|Valid ISO date-<br>time|None|Departure end<br>date filter|
|minPrice|number|No|Number|None|Minimum price<br>filter|
|maxPrice|number|No|Number|None|Maximum price<br>filter|
|minDuration|integer|No|Integer|None|Minimum duration<br>filter|
|maxDuration|integer|No|Integer|None|Maximum duration<br>filter|
|page|integer|No|>= 1|1|Page number|
|limit|integer|No|Integer|12|Items per page|



#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Packages fetched successfully", "data": { "items": [ { "id": "01a0d6db-1046-7108-b80e-1d52334cf02f", "title": "Kedarkantha Winter Trek", "galleryImages": [ "https://example.com/kedarkantha-1.jpg", "https://example.com/kedarkantha-2.jpg" ], "location": { "id": "STATE:5", "name": "Uttarakhand" }, "difficulty": "MODERATE", "durationDays": 6, "trekLeader": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "rating": 5, "startingPrice": null, "originalPrice": null, "currency": null } ], 

"pagination": { "page": 1, "limit": 12, "total": 1, "totalPages": 1 } } } 

#### **Error Responses** 

**Status Code** 400 500 

**Error Message / Condition** Invalid query <u>parameters</u> Internal server error 

### **61. GET /api/package/public/{id}** 

**Purpose:** Public endpoint retrieving complete package presentation details, including full itinerary, inclusions/exclusions, vendor details, team profile, upcoming open departure schedules, and verified customer reviews. 

**Authentication:** None (Public). 

**Path Parameters:** id (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package fetched successfully", "data": { "id": "01a0d6db-1046-7108-b80e-1d52334cf02f", "title": "Kedarkantha Winter Trek", "description": "A scenic winter trek through the Himalayas.", "galleryImages": [ "https://example.com/kedarkantha-1.jpg", "https://example.com/kedarkantha-2.jpg" ], "location": { "id": "STATE:5", "name": "Uttarakhand" }, "difficulty": "MODERATE", "durationDays": 6, "distanceKm": 20, "trekLeader": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "itineraryDays": [ { "id": "01a0d72d-a25e-7d1e-aeb1-7d20e7a0f593", "dayNumber": 2, "title": "Sankri to Juda Ka Talab", "description": "Trek through dense pine forest to Juda Ka Talab.", "startLocation": "Sankri", "endLocation": "Juda Ka Talab", "distanceKm": 4, "duration": "4 hours", 

"altitude": 2780, "imageUrls": [ "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg" ] } ], "inclusions": [ "Accommodation (Tents/Homestays)", "All Meals during the trek", "Qualified Trek Leader" ], "exclusions": [ "Cab fare to Jobra and from Chattru to Manali is not included" ], "packingList": [ "Trekking shoes", "Warm jacket", "Water bottle" ], "fitnessAndExperienceRequirement": "Participants must be able to jog 5 km in 30 minutes. Previous high-altitude experience is recommended but not mandatory.", "meetingPoint": null, "instructions": null, "trekInfo": { "name": "Kedarkantha Trek", "overview": "A scenic winter trek suitable for beginners.", "howToReach": "Reach Dehradun and travel by road to Sankri.", "fitnessInfo": "Basic cardiovascular fitness is recommended.", "safetyInfo": "Carry proper winter gear and follow your guide.", "permitInfo": "Forest permits may be required.", "sustainabilityInfo": "Avoid single-use plastics and follow leave-no-trace practices.", "bestSeason": "December to April", "beginnerFriendly": true, "maxAltitude": 3810 }, "nearbyPlaces": [ { "id": "01a095d5-4979-73a9-9120-b1fe5e88acdf", "name": "Mori Village", "description": "A nearby Himalayan village.", "latitude": 31.05, "longitude": 78.12, "imageUrl": "https://res.cloudinary.com/demo/image/upload/mori.jpg", "distanceFromTrek": 15, "travelTime": "30 minutes", "location": { "id": "DISTRICT:56", "name": "Udam Singh Nagar" } } ], "startingPrice": null, "currency": null, "schedules": [] } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|404|Package not found or is notpublished|
|500|Internal server error|



### **62. GET /api/package/location/{locationId}** 

**Purpose:** Retrieves all active commercial packages operating within a designated geographic location ID. **Authentication:** None (Public). 

**Path Parameters:** locationId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Packages fetched successfully", "data": { "items": [ { "id": "01a0d6db-1046-7108-b80e-1d52334cf02f", "title": "Kedarkantha Winter Trek", "galleryImages": [ "https://example.com/kedarkantha-1.jpg", "https://example.com/kedarkantha-2.jpg" ], "location": { "id": "STATE:5", "name": "Uttarakhand" }, "difficulty": "MODERATE", "durationDays": 6, "trekLeader": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "rating": null, "startingPrice": null, "originalPrice": null, "currency": null } ], "pagination": { "page": 1, "limit": 12, "total": 1, "totalPages": 1 } } } 

**Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|404|Location not found|
|500|Internal server error|



### **63. GET /api/package/upcoming-departures** 

**Purpose:** Fetches imminent open departure schedules across the platform for featured home page display. **Authentication:** None (Public). 

#### **Query Parameters:** 

|**Parameter**|**Type**|**Required**|**Default**|**Description**|
|---|---|---|---|---|
|||||Maximum number of|
|limit|integer|No|10|upcoming departures to<br>return|



#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Upcoming departures fetched successfully", "data": [ { "scheduleId": "sch-9c0b-4ef8-bb6d-6bb9bd380001", "packageId": "pkg-9c0b-4ef8-bb6d-6bb9bd380001", "packageTitle": "Hampta Pass & Chandratal Adventure", "startDate": "2026-10-15T00:00:00.000Z", "endDate": "2026-10-19T00:00:00.000Z", "price": 9500, "availableSeats": 13 } ] } 

#### **Error Responses** 

**Status Code** 500 

**Error Message / Condition** Internal server error 

### **64. GET /api/package/creation-contexts** 

**Purpose:** Supplies dropdown reference contexts required during vendor package authoring (operating locations, accessible master treks, and vendor team memberships). 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role. 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package creation contexts fetched successfully", "data": [ { "type": "INDIVIDUAL", "teamId": null, "name": "Ayaan Ahmed Abbasi", "logoUrl": "https://example.com/profile.jpg", "vendorType": "TREK_LEADER", "maxDifficulty": "MODERATE" }, { "type": "TEAM", 

"teamId": "01a0d38b-3f85-7274-b37d-1ca4a3e60935", "name": "Himalayan Ascents", "logoUrl": "https://example.com/team-logo.jpg", "highestVendorType": "TREK_LEADER", "maxDifficulty": "MODERATE" }, { "type": "TEAM", "teamId": "01a0f12d-02a9-7e54-a49a-ccf000fc4bd8", "name": "Himalayan Ascents", "logoUrl": "https://example.com/team-logo.jpg", "highestVendorType": "TREK_LEADER", "maxDifficulty": "MODERATE" }, { "type": "TEAM", "teamId": "01a0f12e-991a-7af6-bafc-f2490235b4d7", "name": "trec titans", "logoUrl": "https://example.com/team-logo.jpg", "highestVendorType": "TREK_LEADER", "maxDifficulty": "MODERATE" } ] } 

#### **Error Responses** 

**Status Code** 

401 403 500 

**Error Message / Condition** Unauthorized Forbidden: User is not a VENDOR Internal server error 

## **Section 8: Booking APIs (/api/booking)** 

**Mount Point:** /api/booking in 

<mark>src/app.ts</mark> 

#### **Router Source:** 

<mark>src/routes/booking.route.ts</mark> 

#### **Controller Source:** 

<mark>src/controllers/booking.controller.ts</mark> 

#### **Service Source:** 

<mark>src/services/booking.service.ts</mark> 

### **65. POST /api/booking/** 

**Purpose:** Initiates a customer booking reservation for a specific departure schedule. Verifies available capacity, locks seats temporarily, registers participant details, and computes pricing totals. 

**Authentication:** Required (authMiddleware). 

**Authorization:** Authenticated user (USER, VENDOR, ADMIN). 

**Middleware:** authMiddleware, validateBody(createBookingValidator). 

#### **Request Body Schema (createBookingValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|scheduleId|string|Yes|Non-empty string|Schedule being booked|
|adultCount|integer|Yes|>= 1|Number of adult|



|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|||||participants|
|childCount|integer|Yes|>= 0|Number of child<br>participants|



{ "scheduleId": "schedule_123", "adultCount": 2, "childCount": 1 } 

#### **Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Booking initiated successfully", "data": { "id": "01a0f22c-5930-7600-bf98-280b28b9fe41", "scheduleId": "01a0f1bc-50da-76cc-b903-5283457a73cf", "adultCount": 2, "childCount": 1, "subtotal": 54000, "discountAmount": 0, "bookingFee": 0, "totalAmount": 54000, "currency": "INR", "balanceDueDate": null, "status": "PENDING", "bookedAt": "2026-09-30T11:56:27.825Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation failed / requested seats exceed available capacity|
|401|Unauthorized: Missingtoken|
|404|Schedule not found or not open for bookings|
|409|Schedule is fullybooked|
|500|Internal server error|



### **66. GET /api/booking/{bookingId}** 

**Purpose:** Retrieves complete booking details, schedule parameters, participants list, payment logs, and status. 

**Authentication:** Required (authMiddleware). 

**Authorization:** Booking owner, associated vendor/team, or platform admin. 

**Path Parameters:** bookingId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Booking details fetched successfully", "data": { "id": "01a0f22c-5930-7600-bf98-280b28b9fe41", "status": "PENDING", "personalInfo": { 

"firstName": "Aya", "lastName": "Ahmed Abbasi", "email": "itseditz786@gmail.com", "phone": "9876543250", "address": null, "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": null, "message": null }, "orderSummary": { "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "packageTitle": "Shimla", "trekLeader": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "scheduleId": "01a0f1bc-50da-76cc-b903-5283457a73cf", "startDate": "2026-10-10T00:00:00.000Z", "endDate": "2026-10-15T00:00:00.000Z", "adultCount": 2, "childCount": 1, "subtotal": 54000, "discountAmount": 0, "bookingFee": 0, "totalAmount": 54000, "currency": "INR", "cancellationPolicy": "Free cancellation up to 5 days before departure." } } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized|
|403|Forbidden: You do not own this booking|
|404|Bookingnot found|
|500|Internal server error|



### **67. PATCH /api/booking/{bookingId}/contact-info** 

**Purpose:** Modifies emergency phone or contact email details for an active booking. **Authentication:** Required (authMiddleware). **Authorization:** Booking owner or admin. 

**Path Parameters:** bookingId (UUID, required). 

**Request Body Schema (updateContactInfoValidator)** 

{ "firstName": "Ayaan", "lastName": "Ahmed", "email": "itseditz786@gmail.com", "phone": "8967451234", "address": "246 Painter Colony", "city": "Jaipur", 

"state": "Rajasthan", "country": "India", "pinCode": "302016", "message": "Please contact me before departure." } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Booking contact information updated successfully", "data": { "id": "01a0f22c-5930-7600-bf98-280b28b9fe41", "firstName": "Ayaan", "lastName": "Ahmed", "email": "itseditz786@gmail.com", "phone": "8967451234", "address": "246 Painter Colony", "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": "302016", "message": "Please contact me before departure.", "status": "PENDING", "updatedAt": "2026-09-30T12:00:10.941Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Invalid email orphone format|
|401|Unauthorized|
|403|Forbidden|
|404|Bookingnot found|
|500|Internal server error|



### **68. GET /api/booking/{bookingId}/payment-options** 

**Purpose:** Computes available payment breakdowns (full vs. partial milestone) and remaining balances for a booking. **Authentication:** Required (authMiddleware). 

**Path Parameters:** bookingId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Payment options fetched successfully", "data": { "bookingId": "01a0f22c-5930-7600-bf98-280b28b9fe41", "totalAmount": 54000, "currency": "INR", "paymentOptions": { "full": { "available": true, "amount": 54000 }, "deposit": { 

"available": false, "amount": null, "remainingAmount": null, "balanceDueDate": null } } } } 

**Error Responses** 

**Status Code** 

401 404 500 

|**Error Message / Condition**|
|---|
|Unauthorized|
|Bookingnot found|
|Internal server error|



### **69. GET /api/booking/{bookingId}/summary** 

**Purpose:** Retrieves a high-level pricing and itinerary summary for checkout and invoice preview. **Authentication:** Required (authMiddleware). 

**Path Parameters:** bookingId (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Booking summary fetched successfully", "data": { "bookingId": "01a0f22c-5930-7600-bf98-280b28b9fe41", "bookingStatus": "PENDING", "bookedAt": "2026-09-30T11:56:27.825Z", "personalInfo": { "firstName": "Ayaan", "lastName": "Ahmed", "email": "itseditz786@gmail.com", "phone": "8967451234", "address": "246 Painter Colony", "city": "Jaipur", "state": "Rajasthan", "country": "India", "pinCode": "302016", "message": "Please contact me before departure." }, "orderSummary": { "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "packageTitle": "Shimla", "trekLeader": { "id": "01a07f29-3ff9-716d-9c6e-52bb006b78d4", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "scheduleId": "01a0f1bc-50da-76cc-b903-5283457a73cf", "startDate": "2026-10-10T00:00:00.000Z", "endDate": "2026-10-15T00:00:00.000Z", "adultCount": 2, "childCount": 1, "cancellationPolicy": "Free cancellation up to 5 days before departure." 

}, "priceSummary": { "subtotal": 54000, "discountAmount": 0, "bookingFee": 0, "totalAmount": 54000, "currency": "INR" }, "paymentSummary": { "paymentStatus": "UNPAID", "paymentType": null, "amountPaid": 0, "remainingAmount": 54000, "balanceDueDate": null, "paymentGateway": null, "paidAt": null } } } 

**Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized|
|404|Bookingnot found|
|500|Internal server error|



## **Section 9: Payment APIs (/api/payment)** 

**Mount Point:** /api/payment in 

<mark>src/app.ts</mark> 

**Router Source:** 

<mark>src/routes/payment.route.ts</mark> 

**Controller Source:** 

<mark>src/controllers/payment.controller.ts</mark> 

**Service Source:** 

<mark>src/services/payment.service.ts</mark> 

### **70. POST /api/payment/create-order** 

**Purpose:** Creates a Razorpay payment order for an initial booking payment (either full or partial deposit). **Authentication:** Required (authMiddleware). 

**Authorization:** Booking owner. 

**Middleware:** authMiddleware, validateBody(createOrderValidator). 

#### **Request Body Schema (createOrderValidator)** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|bookingId|string|Yes|Valid UUID|Target bookingID|
|amountType|string|Yes|Enum: FULL,PARTIAL|Payment type|



{ "bookingId": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380001", "amountType": "FULL" } 

**Success Response (Status Code 200)** 

{ "statusCode": 201, "success": true, "message": "Payment order created successfully", "data": { "paymentId": "01a0f236-7948-7e1d-bf6c-6277604b8c4f", "bookingId": "01a0f22c-5930-7600-bf98-280b28b9fe41", "paymentType": "FULL", "amount": 54000, "currency": "INR", "razorpayOrderId": "order_TiF6RshSk1HxeI", "razorpayKeyId": "rzp_test_TfLuCF88mS86aT" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Invalidpayment request / bookingalready paid|
|401|Unauthorized|
|404|Bookingnot found|
|500|Razorpay gatewayordergeneration failure|



### **71. POST /api/payment/verify** 

**Purpose:** Verifies Razorpay payment cryptographic signature (HMAC-SHA256). Upon successful verification, transitions booking status to CONFIRMED, creates payment ledger records, and decrements schedule available capacity. **Authentication:** Required (authMiddleware). 

**Middleware:** authMiddleware, validateBody(verifyPaymentValidator). 

#### **Request Body Schema (verifyPaymentValidator)** 

|**Field**|**Type**|**Required**|**Constraints**|**Description**|
|---|---|---|---|---|
|razorpayOrderId|string|Yes|Non-emptystring|Razorpayorder ID|
|razorpayPaymentId|string|Yes|Non-empty string|Razorpay payment<br>transaction ID|
|razorpaySignature|string|Yes|Non-emptyHMAC string|Generated signature|
|bookingId|string|Yes|Valid UUID|Target bookingID|



{ "razorpayOrderId": "order_Hk829J109sLq", "razorpayPaymentId": "pay_Hk839Ak109sM", "razorpaySignature": "9f83ac0892019b88239014a02930419203a1029384", "bookingId": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380001" } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Payment verified successfully", "data": { "paymentId": "01a0f236-7948-7e1d-bf6c-6277604b8c4f", "bookingId": "01a0f22c-5930-7600-bf98-280b28b9fe41", "paymentType": "FULL", "amount": 54000, "currency": "INR", "paymentStatus": "SUCCESS", "bookingStatus": "CONFIRMED", "razorpayPaymentId": "pay_TiF9FDsFevg4hu", 

"paidAt": "2026-09-30T12:13:12.204Z" } 

} 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Invalid signature verification failure|
|401|Unauthorized|
|404|Bookingnot found|
|500|Internal server error|



### **72. POST /api/payment/create-balance-order** 

**Purpose:** Generates a Razorpay payment order to settle the remaining balance on an existing partially paid booking. **Authentication:** Required (authMiddleware). 

Path/Body: validateBody(createBalanceOrderValidator) with bookingId. 

**Request Body Schema (createBalanceOrderValidator)** 

{ "bookingId": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380001" } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 201, "success": true, "message": "Balance payment order created successfully", "data": { "paymentId": "019abc12-3456-789a-bcde-1234567890ab", "bookingId": "019abc12-3456-789a-bcde-9876543210ab", "razorpayOrderId": "order_Q1w2E3r4T5y6U7", "amount": 13000, "amountInPaise": 1300000, "currency": "INR", "paymentType": "BALANCE", "totalAmount": 19000, "amountPaid": 6000, "remainingAmount": 13000, "balanceDueDate": "2026-10-10T00:00:00.000Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Bookinghas no outstandingbalance|
|401|Unauthorized|
|404|Bookingnot found|
|500|Gatewayerror|



### **73. POST /api/payment/webhook** 

**Purpose:** Ingests asynchronous webhook notifications from Razorpay (e.g. payment.captured, payment.failed, refund.processed). 

**Authentication:** Webhook Signature Verification (x-razorpay-signature header). 

**Headers:** x-razorpay-signature: <hmac_hex>. 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Webhook processed successfully", "data": { "received": true } } 

**Error Responses** 

**Status Code Error Message / Condition** 400 Invalid webhook signature or unsupported event 500 Internal processing error 

## **Section 10: Review APIs (/api/review)** 

**Mount Point:** /api/review in 

<mark>src/app.ts</mark> 

#### **Router Source:** 

<mark>src/routes/review.route.ts</mark> 

#### **Controller Source:** 

<mark>src/controllers/review.controller.ts</mark> 

#### **Service Source:** 

<mark>src/services/review.service.ts</mark> 

### **74. POST /api/review/** 

**Purpose:** Submits a verified customer rating and written review for a completed trek booking. 

**Authentication:** Required (authMiddleware). 

**Authorization:** Trekker with a completed booking on the target package. 

**Middleware:** authMiddleware, validateBody(createReviewValidator). 

#### **Request Body Schema (createReviewValidator)** 

|Field|Type|Required|Constraints|Description|
|---|---|---|---|---|
|bookingId|string|Yes|Valid booking ID|ID of completed<br>booking|
|rating|integer|Yes|1 to 5|Overall rating|
|guideExpertise|integer|Yes|1 to 5|Guide expertise rating|
|safetyProtocols|integer|Yes|1 to 5|Safety protocols rating|
|logisticsAndCare|integer|Yes|1 to 5|Logistics and care<br>rating|
|sustainableImpact|integer|Yes|1 to 5|Sustainable impact<br>rating|
|title|string|Yes|String|Review title|
|comment|string|Yes|String|Review comment|
|imageUrls|array of strings|No|URL array|Review image URLs|



{ "bookingId": "01a0c996-ea06-7706-b4eb-2834a5889a13", 

"rating": 5, 

"guideExpertise": 5, 

"safetyProtocols": 5, "logisticsAndCare": 4, "sustainableImpact": 5, "title": "Amazing trekking experience", "comment": "The trek was very well organized.", "imageUrls": [ "https://example.com/review-1.jpg" ] } 

#### **Success Response (Status Code 201)** 

{ "statusCode": 201, "success": true, "message": "Review submitted successfully", "data": { "id": "01a0f24d-11b8-7d6c-a8e8-4183c93d5ec7", "bookingId": "01a0f22c-5930-7600-bf98-280b28b9fe41", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "rating": 5, "guideExpertise": 5, "safetyProtocols": 5, "logisticsAndCare": 4, "sustainableImpact": 5, "title": "Amazing trekking experience", "comment": "The trek was very well organized.", "imageUrls": [ "https://example.com/review-1.jpg" ], "createdAt": "2026-09-30T12:32:12.266Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|400|Validation error / booking is not completed / review already submitted for<br>this booking|
|401|Unauthorized|
|403|Forbidden: You did notparticipate in this booking|
|404|Bookingor Package not found|
|500|Internal server error|



### **75. PATCH /api/review/{reviewId}** 

**Purpose:** Updates an existing review written by the authenticated user. **Authentication:** Required (authMiddleware). **Authorization:** Review author. 

**Path Parameters:** reviewId (UUID, required). 

**Request Body Schema (updateReviewValidator)** 

{ "rating": 5, "guideExpertise": 5, "safetyProtocols": 5, "logisticsAndCare": 5, "sustainableImpact": 5, "title": "string", 

"comment": "string", "imageUrls": [ "https://example.com/review-1.jpg" ] } 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Review updated successfully", "data": { "id": "01a0f24d-11b8-7d6c-a8e8-4183c93d5ec7", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "bookingId": "01a0f22c-5930-7600-bf98-280b28b9fe41", "rating": 5, "guideExpertise": 5, "safetyProtocols": 5, "logisticsAndCare": 5, "sustainableImpact": 5, "title": "string", "comment": "string", "imageUrls": [ "https://example.com/review-1.jpg" ], "createdAt": "2026-09-30T12:32:12.266Z", "updatedAt": "2026-09-30T12:33:43.085Z" } } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized|
|403|Forbidden: Not the author of this review|
|404|Review not found|
|500|Internal server error|



### **76. DELETE /api/review/{reviewId}** 

**Purpose:** Removes a customer review and recalculates package/vendor aggregate ratings. **Authentication:** Required (authMiddleware). **Authorization:** Review author or platform admin. 

**Path Parameters:** reviewId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Review deleted successfully", "data": null } 

#### **Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|401|Unauthorized|
|403|Forbidden|
|404|Review not found|
|500|Internal server error|



### **77. GET /api/review/package/{packageId}** 

**Purpose:** Public endpoint listing all verified customer reviews for a package with pagination and rating breakdown. **Authentication:** None (Public). 

**Path Parameters:** packageId (UUID, required). 

#### **Query Parameters:** 

|**Parameter**|**Type**|**Required**|**Default**|**Description**|
|---|---|---|---|---|
|page|integer|No|1|Page number|
|limit|integer|No|10|Itemsperpage|
|rating|integer|No|None|Filter by exact star rating (1<br>to 5)|



#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Package reviews fetched successfully", "data": { "summary": { "averageRating": 5, "totalReviews": 1, "ratingDistribution": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 1 }, "categories": { "guideExpertise": 5, "safetyProtocols": 5, "logisticsAndCare": 4, "sustainableImpact": 5 } }, "reviews": [ { "id": "01a0da81-6daf-7019-bf8b-cad749bf5d8f", "rating": 5, "guideExpertise": 5, "safetyProtocols": 5, "logisticsAndCare": 4, "sustainableImpact": 5, "title": "Amazing trekking experience", "comment": "The trek was very well organized.", "imageUrls": [ "https://example.com/review-1.jpg" ], "createdAt": "2026-09-25T21:38:30.464Z", "user": { "id": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "name": "Aya Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" } 

} ], "nextCursor": null, "hasNextPage": false } } 

**Error Responses** 

**Status Code Error Message / Condition** 404 Package not found 500 Internal server error 

### **78. GET /api/review/vendor/{userId}** 

**Purpose:** Public endpoint fetching all customer reviews across all packages operated by a specific vendor. **Authentication:** None (Public). 

**Path Parameters:** userId (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor reviews fetched successfully", "data": { "summary": { "averageRating": 5, "totalReviews": 1, "ratingDistribution": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 1 }, "categories": { "guideExpertise": 5, "safetyProtocols": 5, "logisticsAndCare": 4, "sustainableImpact": 5 } }, "reviews": [ { "id": "01a0da81-6daf-7019-bf8b-cad749bf5d8f", "rating": 5, "guideExpertise": 5, "safetyProtocols": 5, "logisticsAndCare": 4, "sustainableImpact": 5, "title": "Amazing trekking experience", "comment": "The trek was very well organized.", "imageUrls": [ "https://example.com/review-1.jpg" ], "createdAt": "2026-09-25T21:38:30.464Z", "user": { 

"id": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "name": "Aya Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" } } ], "nextCursor": null, "hasNextPage": false } } 

**Error Responses** 

**Status Code Error Message / Condition** 404 Vendor not found 500 Internal server error 

### **79. GET /api/review/team/{teamId}** 

**Purpose:** Public endpoint listing all customer reviews associated with all packages published by an agency or operations team. 

**Authentication:** None (Public). 

**Path Parameters:** teamId (UUID, required). 

**Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Team reviews fetched successfully", "data": { "summary": { "averageRating": 0, "totalReviews": 0, "ratingDistribution": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }, "categories": { "guideExpertise": 0, "safetyProtocols": 0, "logisticsAndCare": 0, "sustainableImpact": 0 } }, "reviews": [], "nextCursor": null, "hasNextPage": false } } 

**Error Responses** 

|**Status Code**|**Error Message / Condition**|
|---|---|
|404|Team not found|
|500|Internal server error|



## **Section 11: Vendor APIs (/api/vendor)** 

**Mount Point:** /api/vendor in 

<mark>src/app.ts</mark> 

#### **Router Source:** 

<mark>src/routes/vendor.route.ts</mark> 

#### **Controller Source:** 

<mark>src/controllers/vendor.controller.ts</mark> **Service Source:** <mark>src/services/vendor.service.ts</mark> 

#### **Service Source:** 

### **80. GET /api/vendor/{vendorId}/public-profile** 

**Purpose:** Public endpoint displaying a vendor's public guide profile, certifications, experience history, public ratings, and listed packages. 

**Authentication:** None (Public). 

**Path Parameters:** vendorId (UUID, required). 

#### **Success Response (Status Code 200)** 

{ 

"statusCode": 200, "success": true, "message": "Vendor profile fetched successfully", "data": { "id": "01a07f2a-32dc-7341-8438-7ee6fc1e7ced", "name": "Ayaan Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg", "bio": null, "location": { "city": "Jaipur", "state": "Rajasthan", "country": "India" }, "languages": [ "Hindi", "English" ], "professionalInfo": { "vendorType": "TREK_LEADER", "experienceYears": 5, "treksLed": 20, "regionsWorkedIn": [ "Uttarakhand", "Himachal Pradesh", "Kashmir" ] }, "experiences": [ { "id": "01a0da0b-0d61-7462-9203-e827e5d86136", "description": "Completed Kedarkantha Winter Trek trek through the platform.", "imageUrls": [], "trekName": "Kedarkantha Winter Trek", "difficulty": "MODERATE", "roleDuringTrek": "TREK_LEADER", 

"completedAt": "2026-08-15T00:00:00.000Z", "duration": 6, "altitude": 3810, "proofUrl": null, "verificationStatus": "APPROVED", "source": "PLATFORM", "packageId": "01a0d6db-1046-7108-b80e-1d52334cf02f", "scheduleId": "01a0d75e-e646-7596-a6b5-127e7d5d9629" }, { "id": "01a0f246-e81e-7ae7-ac65-810181f4223f", "description": "Completed Shimla trek through the platform.", "imageUrls": [], "trekName": "Shimla", "difficulty": "MODERATE", "roleDuringTrek": "TREK_LEADER", "completedAt": "2026-03-15T00:00:00.000Z", "duration": 6, "altitude": 3810, "proofUrl": null, "verificationStatus": "APPROVED", "source": "PLATFORM", "packageId": "01a0f163-73b4-7490-b67f-5482c74b94f3", "scheduleId": "01a0f1bc-50da-76cc-b903-5283457a73cf" }, { "id": "01a07f65-3628-7140-bc65-88181c103b33", "description": "Led Hampta Pass trek with a group of 20 trekkers.", "imageUrls": [ "https://example.com/experience1.jpg", "https://example.com/experience2.jpg" ], "trekName": null, "difficulty": null, "roleDuringTrek": null, "completedAt": null, "duration": null, "altitude": null, "proofUrl": null, "verificationStatus": "APPROVED", "source": "SELF_SUBMITTED", "packageId": null, "scheduleId": null } ], "certifications": [ { "id": "01a07f70-272e-748c-ba3d-d5f4e0bbada7", "title": "Basic Mountaineering Certificate", "issuingOrganization": "Nehru Institute of Mountaineering", "certificateNumber": "NIM-BMC-2025-001", "certificateUrl": "https://example.com/certificate.pdf", "issuedAt": "2025-01-01T00:00:00.000Z", "expiresAt": "2030-01-01T00:00:00.000Z", "verificationStatus": "APPROVED" } 

], "badges": [], "packages": [ { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "title": "Shimla", "description": "A scenic winter trek through the Himalayas.", "galleryImages": [ "https://example.com/kedarkantha-1.jpg", "https://example.com/kedarkantha-2.jpg" ] }, { "id": "01a0d6db-1046-7108-b80e-1d52334cf02f", "title": "Kedarkantha Winter Trek", "description": "A scenic winter trek through the Himalayas.", "galleryImages": [ "https://example.com/kedarkantha-1.jpg", "https://example.com/kedarkantha-2.jpg" ] } ] } } 

#### **Error Responses** 

**Status Code Error Message / Condition** 404 Vendor profile not found 500 Internal server error 

### **81. GET /api/vendor/dashboard** 

**Purpose:** Retrieves private business intelligence, total gross revenue, active booking counts, upcoming customer schedules, and performance analytics for the authenticated vendor. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (requireRole("VENDOR")). 

#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor dashboard fetched successfully", "data": { "stats": { "totalEarnings": 108000, "activeTreks": 0, "pendingBookings": 0, "totalTrekkers": 6 }, "revenueTrend": [ { "period": "2026-04", "revenue": 0 }, { "period": "2026-05", 

"revenue": 0 }, { "period": "2026-06", "revenue": 0 }, { "period": "2026-07", "revenue": 0 }, { "period": "2026-08", "revenue": 0 }, { "period": "2026-09", "revenue": 108000 } ], "pendingBookings": [], "activeTreks": [] } } 

**Error Responses** 

**Status Code Error Message / Condition** 401 Unauthorized: Missing or invalid token 403 Forbidden: User is not a VENDOR 500 Internal server error 

### **82. GET /api/vendor/bookings** 

**Purpose:** Lists all bookings across all packages owned or operated by the authenticated vendor, with status and date filters. 

**Authentication:** Required (authMiddleware). 

**Authorization:** VENDOR role (requireRole("VENDOR")). 

#### **Query Parameters:** 

|Parameter|Type|Required|Default|Description|
|---|---|---|---|---|
|search|string|No|None|Search bookings|
|status|string|No|None|PENDING,<br>CONFIRMED,<br>CANCELLED,<br>COMPLETED|
|packageId|string|No|None|Filter by package ID|
|limit|integer|No|10|Items per page|
|cursor|string|No|None|Pagination cursor|



#### **Success Response (Status Code 200)** 

{ "statusCode": 200, "success": true, "message": "Vendor bookings fetched successfully", "data": { 

"summary": { "totalBookings": 2, "pendingBookings": 0, "confirmedRevenue": 108000, "upcomingTreks": 0 }, "bookings": [ { "bookingId": "01a0f22c-5930-7600-bf98-280b28b9fe41", "trekker": { "id": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "name": "Aya Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "package": { "id": "01a0f163-73b4-7490-b67f-5482c74b94f3", "title": "Shimla" }, "schedule": { "id": "01a0f1bc-50da-76cc-b903-5283457a73cf", "startDate": "2026-03-10T00:00:00.000Z", "endDate": "2026-03-15T00:00:00.000Z" }, "adultCount": 2, "childCount": 1, "participantCount": 3, "totalAmount": 54000, "currency": "INR", "status": "COMPLETED", "bookedAt": "2026-09-30T11:56:27.825Z" }, { "bookingId": "01a0d94a-084a-78e6-8210-5c06743a9864", "trekker": { "id": "01a0d3a9-b7b3-78df-9f39-d49f1feff13b", "name": "Aya Ahmed Abbasi", "avatarUrl": "https://example.com/profile.jpg" }, "package": { "id": "01a0d6db-1046-7108-b80e-1d52334cf02f", "title": "Kedarkantha Winter Trek" }, "schedule": { "id": "01a0d75e-e646-7596-a6b5-127e7d5d9629", "startDate": "2026-08-10T00:00:00.000Z", "endDate": "2026-08-15T00:00:00.000Z" }, "adultCount": 2, "childCount": 1, "participantCount": 3, "totalAmount": 54000, "currency": "INR", "status": "COMPLETED", "bookedAt": "2026-09-25T15:58:22.796Z" } ], 

"nextCursor": null, "hasNextPage": false } } 

**Error Responses** 

**Status Code Error Message / Condition** 401 Unauthorized: Missing or invalid token 403 Forbidden: User is not a VENDOR 500 Internal server error 

## **Section 12: Root System API (/)** 

**Mount Point:** Direct root route on app in 

<mark>src/app.ts</mark> 

### **83. GET /** 

**Purpose:** System root health-check and entry gateway endpoint returning platform service availability status. **Authentication:** None (Public). 

**Authorization:** None. 

**Middleware:** None. 

**Success Response (Status Code 200)** 

{ "message": "Welcome to Scout API" } 

#### **Error Responses** 

**Status Code Error Message / Condition** 500 Internal server error 

