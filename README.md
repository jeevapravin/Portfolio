# 3D Developer Portfolio

A modern, immersive developer portfolio website built with React, Three.js, and Tailwind CSS. Features interactive 3D elements, smooth animations, and a responsive design.

Portfolio Link:
https://jeevapravin.vercel.app

## 🚀 Tech Stack

-   **Frontend Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **3D Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Interactive Globe**: [Cobe](https://github.com/shuding/cobe)
-   **Email Service**: [EmailJS](https://www.emailjs.com/)

## ✨ Features

-   **Immersive 3D Experience**: Interactive globe and particle effects.
-   **Responsive Design**: Fully responsive layout for all devices.
-   **Smooth Animations**: Page transitions and scroll animations using Framer Motion.
-   **Project Showcase**: Detailed view of projects with descriptions and links.
-   **Contact Form**: Functional contact form integrated with EmailJS.

## 🛠️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/jeevapravin/Portfolio.git
    cd Portfolio
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Variables**

    Create a `.env` file in the root directory and add your EmailJS configuration:

    ```env
    VITE_APP_EMAILJS_SERVICE_ID=your_service_id
    VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
    ```

4.  **Run Development Server**

    ```bash
    npm run dev
    ```

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` folder.
