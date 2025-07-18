# Students Project

Hello students, I hope you are all doing well. I have created this project which summarizes almost everything you need to know for building a comprehensive full-stack application with DevOps practices. Don't hesitate to add new features to the project or ask me anything.

## Project Architecture

The project follows a classic server-client architecture with the following flow:
```
Database → Backend → Frontend → User
```

The DevOps architecture diagram will be provided separately in a DrawIO format.

## Technology Stack

- **Backend**: JavaScript with Node.js framework
- **Frontend**: React with Node.js and Nginx
- **Database**: PostgreSQL
- **Container Orchestration**: Kubernetes with Minikube
- **Package Management**: Helm (mandatory)

## Development Setup

To get started with development, you will need to:

1. Create `.env` files for both backend and frontend applications
2. Run `npm install` to install the node_modules (which I have deleted from the repository)
3. These dependencies are essential for running the Node.js applications

## Database Configuration

For the real DevOps implementation, you will need to:

1. Configure and create a new PostgreSQL database
2. Modify the `postgresql.conf` file to work with Minikube as the host
3. Update the `pg_hba.conf` file to adjust security measurements

If you don't understand these configuration steps, please reach out to me or consult with an AI assistant.

## SSL Certificate Management

You must create a cert-manager that will handle the entire SSL certificate process for the application.

## Observability

The project includes an observability layer that implements 2 out of the 3 main pillars of observability (metrics, logs, and traces).

## Important Guidelines

### Helm Integration
- **Every Kubernetes resource must be created using Helm**
- Helm integration is mandatory for this project
- Without proper Helm usage, the project will be considered incomplete

### Cloud Resource Management
- **Always shut down your cloud resources when not in use**
- Never leave any resources running unnecessarily
- Create a script that automatically checks and validates resource cleanup
- This is especially critical when working with multiple cloud resources

### Getting Help
- If you encounter any problems, reach out to me or use ChatGPT for assistance
- Always consult with me, ChatGPT, Ron, or Tom when choosing the latest technologies

### Project Extensions
You are encouraged to add more components to this project if you feel you can improve it:
- Distributed tracing
- ArgoCD
- OpenShift
- Any other relevant technologies

However, the current project scope should be sufficient for demonstrating core DevOps principles.

## Project Goals

This project is designed to simulate a real-world application that incorporates all major DevOps components:
- If there's no cert-manager, it's a problem
- If there's no database, it's also an issue
- If you prefer to host the database on your local machine, that's acceptable, but always use the most current technologies

Remember to always consult with me, ChatGPT, Ron, or Tom regarding the latest technologies and best practices.

Good luck with the project!
