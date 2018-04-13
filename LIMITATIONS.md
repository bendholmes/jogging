# Limitations ❤️🔥

Due to the time constraints there are some limitations with the project, however I don't believe any of them to be of a critical nature. Most of these are 'nice to haves' and 'would be great on a project that is actively being built and maintained'. And of course, there's pretty much no limit to the amount of polishing that can be applied to a software application - so here we go!

### Usage of a Component Library

Using an established component library, such as the Material UI, would greatly enhance the UX. It would look much nicer and provide more powerful components for the presentation and interactivity with the data. Of course this can also bring added complexity, which is why it was avoided for a project with such time limitations and lack of emphasis on UI / UX.

### Client Side API Error Handling

The error handling of API responses is quite limited. The app behaves correctly, but the communication to the user is in the form of raw error response messages. This UX could easily be improved by using the detail messages provided by the API, which could also be augmented.

### ABAC Permissions

Since only a few permission roles were required, it made sense to make use of the existing Django permission flags on the user model. If more permissions are desired, switching to an ABAC (attribute-based access control) system would be preferable. This is easy to implement using Django groups and roles, however until then - YAGNI.

### Shared Component Logic

Some of the app components share logic, such as the handling of CRUD requests and the associated callbacks. The project handles this with several abstractions, higher order components and util functions, however it could be further improved.

### Front End Selenium & Unit Tests

There are no tests of the front end, although this shouldn't be surprising given the time constraints. End to end functional tests provide the least value of all types of test and take much longer to implement. The focus was on a comprehensive API test suite since that is what drives the application. Further reading at https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html.

### Timezone Support

Timezones were disabled to avoid needless complexity. This is fairly straightforward to add through a few Django settings, but there are always edge cases with timzones when it comes to formatting and other date operations.

### i18n and l10n

No explanation needed, if the product goes global then we'll add this! 😂

### Front End Input Validation

This comes back to the usage of a UI library, but handling validation on the frontend and communicating issues to the user directly is a nicer UX than relying on the backend responses, even though everything is validated correctly.

### Front End State - Redux and Beyond

Since the app is quite simple with minimal state, the added complexity of a third party state management library was avoided. However, if further features were to be added it would be worth introducing Redux or an equivalent. It would also be nice to use some more efficient data structures that maintain sorted lists according to chosen orderings and map objects by key for faster lookup where applicable.

### Usage of Proptypes

Declaring proptypes makes the code a little more robust and easier to maintain, enforcing certain props of specific types to be set on components that need them. This can help uncover otherwise hidden bugs.

### XSS Prevention

Although I have built in XSS prevention, it is a little crude - we simply escape all text input that could otherwise contain a malicious attack vector. A nicer solution might be to strip these tags completely or simply whitelist allowed characters for fields like usernames and passwords.

### Websockets / Pusher

The app currently does not receive push updates from the server. This means if a third party updates some shared data, such as another device or browser tab, the app will not update the data shown to the user until they complete an action that invokes a re-fetch of the data that was updated. The use of websockets or pusher can help with this, ensuring updates are queued and sent to relevant users as they use the app, preventing stale data. This however introduces questions around synchronization, fun!

### Server Side Rendering

Initial states in the app can be pre-rendered server side to help improve initial load times.

### Batch Generation of Weekly Jogging Reports

Currently the weekly jogging reports are generated on demand. Whilst this is nice for any changes made to jogs in the past, in reality most of these reports won't change as the weeks go by. These could instead be generated on a weekly basis via a configured task queue (e.g. Amazon Simple Queue Service), with any updates simply triggering an update task. This will be much nicer on the server assuming we gain thousands of users.

### Rendering Animations & Transitions

The initial states of components could be improved dramatically by adding simple animations on first render and transitions between states.

### Homepage

Would probably be nice to have one...

