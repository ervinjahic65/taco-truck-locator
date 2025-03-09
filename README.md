# Taco Truck Locator

This project is a simple web application that helps you locate taco trucks. It's built using Express.js, jQuery, HTML, and CSS.

## Table of Contents

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

You'll need to have the following installed on your machine:

*   **Node.js and npm:**  Make sure you have Node.js and npm (Node Package Manager) installed. You can download them from [https://nodejs.org/](https://nodejs.org/).  A relatively recent version (like 14 or later) is recommended.
* **Git**: for cloning project

### Installation

1.  **Clone the repository:**

    Open your terminal (or command prompt) and run the following command to clone this project's repository:

    ```bash
    git clone <repository_url>  # Replace <repository_url> with the actual URL of the repository.
    ```
    If don't have url just skip this step

2.  **Navigate to the project directory:**

    ```bash
    cd taco-truck-locator 
    ```

3.  **Install dependencies:**

    Install the project's dependencies using npm:

    ```bash
    npm install
    ```

4.  **Create a `.env` file:**

    *   Create a new file named `.env` in the root directory of the project (same level as `README.md`, `package.json`, etc.).
    * add there enviroment variables

## Running the Application

To start the application, use the following command in your terminal (from the project's root directory):

```bash
nodemon server.js
