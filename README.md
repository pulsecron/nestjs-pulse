<p align="center">
  <img src="./pulse.png" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">Nestjs-Pulse</h1>
</p>
<p align="center">
    <em>The modern MongoDB-powered scheduling library for NestJS</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/pulsecron/nestjs-pulse?style=default&logo=opensourceinitiative&logoColor=white&color=24E0A4" alt="license">
	<img src="https://img.shields.io/github/last-commit/pulsecron/nestjs-pulse?style=default&logo=git&logoColor=white&color=24E0A4" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/pulsecron/nestjs-pulse?style=default&color=24E0A4" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/pulsecron/nestjs-pulse?style=default&color=24E0A4" alt="repo-language-count">
<p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>

<br><!-- TABLE OF CONTENTS -->


<details>
  <summary>Table of Contents</summary><br>

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Example](#example)
      - [app.module.ts](#appmodulets)
      - [notification.module.ts](#notificationmodulets)
      - [notification.processor.ts](#notificationprocessorts)
- [Contributing](#contributing)
- [License](#license)
</details>
<hr>

##  Overview

[Pulse](https://github.com/pulsecron/nestjs-pulse) module for [NestJS](https://nestjs.com/)

---
<br/>
<br/>







##  Getting Started



####  Installation

 ```console
 $ npm install --save @pulsecron/nestjs-pulse @pulsecron/pulse
```



####  Example

##### app.module.ts
```typescript
// src/app.module.ts

import { Module } from '@nestjs/common';
import { PulseModule } from '@pulsecron/nestjs-pulse';
import { NotificationsModule } from './notification/notification.module';

@Module({
  imports: [
    PulseModule.forRoot({
      db: {
        address: 'mongodb://localhost:27017/pulse',
      },
    }),
    NotificationsModule,
  ],
  providers: [],
})
export class AppModule {}

```

##### notification.module.ts
```typescript
// src/notification/notification.module.ts

import { Module } from '@nestjs/common';
import { PulseModule } from '@pulsecron/nestjs-pulse';
import { NotificationsQueue } from './notification.processor';

@Module({
  imports: [
    PulseModule.registerQueue('notifications', {
      processEvery: '3 minutes',
      autoStart: false, // default: true
    }),
  ],
  providers: [NotificationsQueue],
  exports: [],
})
export class NotificationsModule {}

```

##### notification.processor.ts
```typescript
// src/notification/notification.processor.ts

import { Job } from '@pulsecron/nestjs-pulse';
import { Every, Queue } from '@pulsecron/nestjs-pulse';

@Queue('notifications')
export class NotificationsQueue {
  @Every({ name: 'send notifications', interval: '3 minutes' })
  async sendNotifications(job: Job) {
    console.log('Sending notifications');
  }

  @Scheduler({ name: 'send notifications', when: 'tomorrow at noon' })
  async sendNotifications(job: Job) {
    console.log('Sending notifications');
  }

  @Now()
  async sendNotifications(job: Job) {
    console.log('Sending notifications');
  }
}



```


---
<br/>
<br/>

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/pulsecron/nestjs-pulse/issues)**: Submit bugs found or log feature requests for the `pulse` project.
- **[Submit Pull Requests](https://github.com/pulsecron/nestjs-pulse/pulls)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/pulsecron/nestjs-pulse/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/pulsecron/nestjs-pulse
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="center">
   <a href="https://github.com{/pulsecron/nestjs-pulse/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=pulsecron/nestjs-pulse">
   </a>
</p>
</details>

---
<br/>
<br/>

##  License

This project is protected under the [MIT](https://github.com/pulsecron/nestjs-pulse?tab=MIT-1-ov-file#readme) License. For more details, refer to the [LICENSE](https://github.com/pulsecron/nestjs-pulse?tab=MIT-1-ov-file#readme) file.

---
<br/>
<br/>

