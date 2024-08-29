# oMERCADO


## Description

oMERCADO is an e-commerce store for services with a customer and seller view. Sellers can add their services to sell and control their stock. Customers can purchase services and view their past transactions. A client can have both 'customer' and 'seller' profile.

## User Stories

- **404:** As a user I get to see a 404 page with a feedback message if I try to reach a page that does not exist so that I know it's my fault.
- **Main Page:** Any anonymous user can access the main page and make a purchase as a guest.
- **Signup Customer:** As an anonymous user I can sign up on the platform so that I can see my purchases.
- **Signup Seller:** As an anonymous user I can sign up on the platform so that I can add my services to sell and see my dashboard.
- **Login Customer:** As a customer I can login to the platform so that I can access my profile and see my purchases.
- **Login Seller:** As a seller I can login to the platform so that I can add my services to sell and see my dashboard.
- **Logout:** As a logged in user I can logout from the platform so no one else can use my profile.
- **Profile Page Customer**: As a logged in customer I can visit my profile page so that I can access the items I bought.
- **Profile Page Seller**: As a logged in seller I can visit my profile page so that I can view, edit and delte the services I created and view the services I sold.
- **Add Item Seller:** As a logged in seller I can add a new service to sell.
- **Edit Item Seller:** As a logged in seller I can edit the item I created.
- **Add to Cart:** As a customer (logged in or not) I can add a service to the cart.
- **Edit Cart:** As a customer (logged in or not) I can edit the cart.
- **Payment:** As a customer (logged in or not) I can pay through the payment form.
- **Success Payment:** As a customer (logged in or not) I receive confirmation if the payment is processed successfully.

# Client / Frontend

## React Router Routes (React App)

| Path                        | Component         | Permissions                | Behavior                                          |
| --------------------------- | ----------------- | -------------------------- | ------------------------------------------------- |
| `/`                         | HomePage          | public `<Route>`           | Homepage.                                         |
| `/main`                     | MainServicesPage  | public `<Route>`           | Main page with all listed services.               |
| `/signup`                   | SignupPage        | anon only `<AnonRoute>`    | Signup form, navigates to main page after signup. |
| `/login`                    | LoginPage         | anon only `<AnonRoute>`    | Login form, navigates to main page after login.   |
| `/user-profile`             | UserProfile       | user only `<PrivateRoute>` | User dashboard for the current user.              |
| `/add-service`              | AddService        | user only `<PrivateRoute>` | Create new service form.                          |
| `/services/:serviceId`      | SingleServicePage | public `<Route>`           | Service details.                                  |
| `/services/edit/:serviceId` | EditService       | user only `<PrivateRoute>` | Edit service details.                             |
| `/cart`                     | Cart              | public `<Route>`           | Cart page with a summary of all added services.   |
| `/checkout`                 | Checkout          | public `<Route>`           | Payment form.                                     |
| `/payment-completed`        | SuccessPayment    | public `<Route>`           | Displays a message after payment is completed.    |
| `*`                         | Teapot            | public `<Route>`           | 404 Error message.                                |

## Components

Pages:

- HomePage
- MainServicesPage
- SignupPage
- LoginPage
- UserProfile
- AddService
- SingleServicePage
- EditService
- Cart
- Checkout
- SuccessPayment
- Teapot

Components:

- Navbar
- Anon
- Layout
- Private
- Search

<br>

# Server / Backend

## Models

**User model**

```javascript
{
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minLength: 8,
  },
  typeOfUser: [
    { type: String, required: true, enum: ['Customer', 'Seller'] },
  ],
  name: String,
  img: String,
  servicesBought: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  servicesOffered: [{ type: Schema.Types.ObjectId, ref: 'Service' }]	,
  servicesSold: [
    {
      serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
      quantity: Number
    }
  ],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
},
{
  timestamps: true,
}
```

**Service model**

```javascript
{
  serviceName: { type: String, required: true },
  serviceDescription: { type: String, required: true },
  quantity: {
    type: number,
    required: true,
    min: 0,
    max: 100,
    default: 1,},
  date: String,
  img: String,
  category: {
    type: [String],
    required: true,
    enum: [
      'Art',
      'Design',
      'Food',
      'Sport',
      'Technology',
      'Travel',
    ],
  },
  createdBy: { type: Schema.Types.ObjectId, ref:'User' },
  isActive: { type: Boolean, default: true }
}
```

**Transaction model**

```javascript

{
  cart: [
    {
      serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
      quantity: Number,
      unitPrice: Number,
    },
  ],
  total: Number,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true,
}

```

<br>

## API Endpoints (backend routes)

| HTTP Method | URL                             | Request Body                                                              | Success status | Error Status | Description                                                                                                      |
| ----------- | ------------------------------- | ------------------------------------------------------------------------- | -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------- | 
| GET         | `/auth/verify`                  |                                                                           | 200            | 404          | Check if token is valid                                                                                          |
| POST        | `/auth/signup`                  | {email, password, typeOfUser, name}                                       | 201            | 404          | Check if fields not empty (422) and user already exists (409), then create user with encrypted password          |
| POST        | `/auth/login`                   | {email, password}                                                         | 200            | 401          | Check if fields not empty (422), if user exists (404), and if password matches (404), then creates and sends JWT |
| GET         | `/api/services`                 |                                                                           | 200            | 400          | Show all services                                                                                                |
| GET         | `/api/services/:serviceId`      |                                                                           | 200            | 400          | Show specific service                                                                                            |
| POST        | `/api/services`                 | { serviceName, serviceDescription, quantity, price, date, img, category } | 201            | 400          | Create and save a new service                                                                                    |
| PUT         | `/api/services/edit/:serviceId` | { serviceName, serviceDescription, quantity, price, date, img, category } | 200            | 400          | Edit service                                                                                                     |
| DELETE      | `/api/services/:id`             |                                                                           | 204            | 400          | Delete service                                                                                                   |
| PUT         | `/api/services/:id`             | {isActive}                                                                | 200            | 400          | Desactivate service                                                                                              |
| GET         | `/api/user/:userId`             |                                                                           | 200            | 400          | Show specific user details user                                                                                  | 
| POST        | `/api/checkout`                 | { userId, cart, total }                                                   | 200            | 400          | Create new transaction and add it to buyer's servicesBought and seller's servicesSold                            |
| POST        | `/api/cartInfo`                 | {cart}                                                                    | 200            | 400          | Fetch services info for each item in the cart                                                                    |

<br>

<br>

## Packages

- Tailwind
- Phosphor Icons

<br>

## Links

### Git

[Client repository Link](https://github.com/MagdaDra/project_3_client.git)

[Server repository Link](https://github.com/MagdaDra/project_3_server.git)

[Deployed App Link](https://omercado.netlify.app/)

### Slides

[Slides Link](http://slides.com) - The url to your _public_ presentation slides

### Contributors

Magdalena Draszczyk - <https://github.com/MagdaDra> - <https://www.linkedin.com/in/magdalenadraszczyk/>
