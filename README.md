Project Title: **Strings & Things**.

**Description**:

Strings & Things is a web application created to sell guitars and guitar paraphernalia. The project is developed using the TypeScript (TS) language, which allows for increased static typing and easier development due to strict data types.

**Technologies and tools:**

1. Programming Language: TypeScript (TS) - the choice of TypeScript provides high code safety, hints and bug tracking during the development phase.
2. Testing: Jest - a testing framework that provides creation and execution of test scripts to verify the correctness of the application.
3. Code Style and Formatting: ESLint and Prettier - used to keep code clean and standardized according to set rules.
4. Pre-commit checks: Husky - designed to automatically check code before committing, which prevents incorrect or unformatted code from entering the repository.
5. Styles: SCSS - a preprocessor for CSS that provides variables, mixins, and other features that make it easy to write and maintain styles.
6. Assembly: Webpack - used to assemble all components, styles, and other resources into optimized packages for deployment to the server.

**Functionality:**

- Display a catalog of products with guitars and guitar paraphernalia, with the ability to view the details of each product.
- Filtering products by various criteria such as price, brand, guitar type, etc.
- Adding items to cart and placing an order.
- User registration and authorization to be able to track order status and purchase history.
- Search by goods for convenient and quick finding of the goods the user is interested in.
- Administrative panel for managing the product catalog and orders.

**Used scripts:**

- Runs development build of the project with source map enabled for easy debugging:
  `*npm run dev*`.
- Runs production build of the project, optimizing it and reducing its size by excluding source map to reduce weight:
  `*npm run prod*`.
- Runs development build and opens dev server for fast development and real-time testing:
  `*npm run serve*`.
- Runs ESLint to check code against coding standards and detect potential problems:
  `*npm run lint*`.
- Runs Jest tests to ensure code is working correctly and reliable:
  `*npm test*`.
- Allows you to add hooks for Husky. For example, you can add a hook to automatically run tests before each commit:
  `*npx husky add <file> [cmd]*`
- Performs code verification and deploys the project to the server:
  `*npm run deploy*`.

**To run the project locally:**

1. Clone the repository:
   `git clone git@github.com:MaleryValery/eComm.git`.
2. Go to the develop branch:
   `git checkout develop`.
3. Build the project via dev-server:
   `npm run serve`.
