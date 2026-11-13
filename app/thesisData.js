export const thesisData = {
  title: "Bus Smart System Application",
  author: {
    name: "Ayesha Batool",
    rollNumber: "M245004",
    degree: "Bachelor of Science in Computer Science",
    department: "Department of Computer Science",
    university: "Gomal University, Faisalabad",
    year: "2026",
    supervisor: "Mam Mehwish"
  },
  declaration: {
    title: "DECLARATION",
    content: "The work reported in this thesis was carried out by me under the supervision of Mam Mehwish, Department of Computer Science, Gomal University, Faisalabad, Pakistan.\n\nI hereby declare that the title of thesis Bus Smart System Application and the contents of thesis are the product of my own research and no part has been copied from any published source (except the references, standard mathematical or genetic models /equations /formulas/protocols etc). I further declare that this work has not been submitted for award of any other degree /diploma. The University may take action if the information provided is found inaccurate at any stage."
  },
  certificate: {
    title: "CERTIFICATE BY SUPERVISORY COMMITTEE",
    content: "We certify that the content and form of thesis submitted by Ayesha Batool Registration No: M245004 has been found satisfactory and in accordance with the prescribed format. We recommend it to be proceed for the evaluation by the external Examiner for the award of degree.\n\nSignature of Supervisor: Mam Mehwish\nDesignation with Stamp: Supervisor, Dept of Computer Science\nUniversity: Gomal University Faisalabad"
  },
  acknowledgments: {
    title: "ACKNOWLEDGMENTS",
    content: "Firstly, we are thankful to ALLAH ALMIGHTY who blessed us with knowledge to complete this project with HIS mercy. In completing this undergraduate project, I have been fortunate to have help, support and encouragement from others around me.\n\nI would like to acknowledge them for their cooperation. Firstly, I would like to thank my project supervisor Mam Mehwish, Gomal University Faisalabad for guiding me through each step of the process with knowledge and support. Thank you for your advice, guidance and assistance. She has been a constant source of guidance throughout the course of this project. We are also thankful to our families and friends whose silent support led us to complete our project."
  },
  chapters: [
    {
      id: "ch1",
      number: "1",
      title: "Introduction",
      sections: [
        {
          id: "1.1",
          title: "Introduction",
          content: "The Bus Smart System App is an advanced smart transportation management application designed to improve public and private bus transportation systems using IoT technologies, GPS tracking, cloud computing, and mobile applications. The application allows passengers, drivers, and transport management authorities to monitor buses in real time and manage transportation operations efficiently.\n\nThe system provides live bus tracking, smart attendance management, digital ticketing, route optimization, fuel monitoring, emergency alerts, driver behavior analysis, and passenger notifications through a user-friendly mobile application. The Bus Smart System App improves communication between passengers, bus drivers, and transportation management systems."
        },
        {
          id: "1.2",
          title: "Background of the Study",
          content: "Modern transportation systems are moving toward digital transformation through smart technologies and intelligent transportation systems (ITS). Traditional bus systems often face problems such as delays, lack of route transparency, poor passenger communication, inefficient fuel management, and limited safety monitoring.\n\nWith the rapid growth of IoT devices, GPS modules, mobile applications, and cloud-based systems, smart transportation solutions are becoming essential for improving public transport efficiency and passenger satisfaction.\n\nThe Bus Smart System App is designed to address these transportation challenges by integrating smart monitoring systems with mobile and cloud technologies."
        },
        {
          id: "1.3",
          title: "Problem Statement",
          content: "Traditional bus transportation systems face multiple challenges such as:\n\n* No real-time bus tracking\n* Passenger uncertainty regarding bus arrival times\n* Poor communication between drivers and passengers\n* Manual ticketing systems\n* Lack of safety monitoring\n* Fuel misuse and inefficient route management\n* Limited emergency response systems\n* No centralized monitoring platform\n* Difficulty in tracking school or company buses\n\nA smart bus management system is required to improve transportation efficiency, safety, and convenience."
        },
        {
          id: "1.4",
          title: "Objectives of the Project",
          content: "Main Objective:\nTo design and develop a Bus Smart System App that improves transportation management, passenger safety, route monitoring, and operational efficiency.\n\nSpecific Objectives:\n* Enable real-time GPS bus tracking\n* Provide estimated arrival time notifications\n* Implement digital ticketing system\n* Monitor driver behavior and bus speed\n* Track fuel consumption and maintenance records\n* Provide emergency alert system\n* Enable route optimization and scheduling\n* Improve passenger safety and convenience\n* Generate transportation analytics and reports\n* Provide smart attendance for school or company buses"
        },
        {
          id: "1.5",
          title: "Scope of the Project",
          content: "The project includes:\n\n* Real-Time Bus Tracking\n* GPS Navigation System\n* Smart Ticketing System\n* Passenger Notification System\n* Emergency Alert System\n* Driver Monitoring\n* Fuel Monitoring\n* Route Optimization\n* Bus Attendance Management\n* Maintenance Monitoring\n* Fleet Management Dashboard\n* Smart Scheduling System\n* Mobile App Integration"
        },
        {
          id: "1.6",
          title: "Significance of the Project",
          content: "For Passengers:\n* Live bus location tracking\n* Reduced waiting time\n* Improved travel convenience\n* Better safety monitoring\n* Real-time notifications and alerts\n\nFor Transport Management:\n* Better fleet management\n* Improved operational efficiency\n* Reduced fuel wastage\n* Better route planning\n* Centralized monitoring system\n\nFor Educational Institutions and Companies:\n* Smart attendance management\n* Employee/student transportation tracking\n* Improved security and communication"
        }
      ]
    },
    {
      id: "ch2",
      number: "2",
      title: "Literature Review / Existing System",
      sections: [
        {
          id: "2.1",
          title: "Introduction",
          content: "This chapter discusses existing transportation management systems, their limitations, and the advantages of implementing a smart bus monitoring system."
        },
        {
          id: "2.2",
          title: "Existing System",
          content: "Most conventional bus transportation systems rely on manual monitoring and traditional ticketing methods. Passengers often experience uncertainty about bus arrival times and transportation schedules.\n\nSome transportation companies provide GPS tracking, but these systems usually lack advanced features such as analytics, passenger alerts, fuel monitoring, and emergency management."
        },
        {
          id: "2.3",
          title: "Problems in Existing System",
          content: "* Limited live tracking functionality\n* No centralized fleet monitoring\n* Poor passenger communication\n* Manual attendance and ticketing system\n* Lack of emergency alert system\n* Inefficient route planning\n* Limited maintenance tracking\n* Security and safety concerns"
        },
        {
          id: "2.4",
          title: "Proposed System",
          content: "The proposed Bus Smart System App integrates:\n\n* IoT Sensors\n* GPS Modules\n* Mobile Applications\n* Cloud Computing\n* Real-Time Monitoring\n* AI-Based Analytics\n* Digital Ticketing\n* Emergency Notification Systems\n\nThe system provides a complete smart transportation solution for schools, universities, offices, and public transport systems."
        },
        {
          id: "2.5",
          title: "Advantages of Proposed System",
          content: "* Real-time bus tracking\n* Better passenger communication\n* Enhanced safety monitoring\n* Automated attendance system\n* Smart ticketing and payment\n* Improved route management\n* Fuel consumption monitoring\n* Centralized fleet control\n* Reduced operational costs"
        }
      ]
    },
    {
      id: "ch3",
      number: "3",
      title: "System Analysis and Requirements",
      sections: [
        {
          id: "3.1",
          title: "Functional Requirements",
          content: "The Bus Smart System App should include the following functionalities:\n\n* User Login and Registration\n* Bus Registration and Pairing\n* Real-Time GPS Tracking\n* Passenger Notification System\n* Route Scheduling\n* Digital Ticketing\n* Attendance Monitoring\n* Emergency Alert System\n* Driver Monitoring\n* Fuel Monitoring\n* Bus Maintenance Reports\n* Dashboard Analytics\n* Admin Management Panel"
        },
        {
          id: "3.2",
          title: "Non-Functional Requirements",
          content: "* High Security\n* Fast System Response\n* Reliability\n* Scalability\n* Cloud Availability\n* User-Friendly Interface\n* Data Accuracy\n* System Stability\n* Real-Time Performance"
        },
        {
          id: "3.3",
          title: "Hardware Requirements",
          content: "* GPS Tracking Module\n* RFID Scanner / QR Scanner\n* ESP32 / Arduino Controller\n* Fuel Monitoring Sensors\n* GSM / LTE Communication Module\n* Emergency Button System\n* Camera Module (Optional)\n* CAN Bus Interface\n* Smart Attendance Scanner"
        },
        {
          id: "3.4",
          title: "Software Requirements",
          content: "* Flutter / React Native\n* Node.js / Python Backend\n* Firebase / AWS Cloud\n* MySQL / MongoDB Database\n* Google Maps API\n* REST APIs\n* MQTT Communication Protocol"
        },
        {
          id: "3.5",
          title: "Feasibility Study",
          content: "Technical Feasibility:\nThe project can be implemented using existing IoT devices, GPS systems, cloud technologies, and mobile application frameworks.\n\nEconomic Feasibility:\nThe system is cost-effective for educational institutions, transport companies, and public transportation sectors.\n\nOperational Feasibility:\nThe application provides an easy-to-use interface for passengers, drivers, and administrators."
        }
      ]
    },
    {
      id: "ch4",
      number: "4",
      title: "System Design",
      sections: [
        {
          id: "4.1",
          title: "System Architecture",
          content: "Sensor Layer → GPS & Communication Layer → Cloud Server → Mobile Application → Admin Dashboard\n\nThe architecture consists of:\n* Bus Sensors and GPS Devices\n* Internet Communication Layer\n* Cloud Database and APIs\n* Mobile Application Interface\n* Web Admin Panel"
        },
        {
          id: "4.2",
          title: "Database Design",
          content: "Tables in database:\n* Users\n* Drivers\n* Buses\n* Routes\n* GPS Logs\n* Attendance Records\n* Tickets\n* Fuel Logs\n* Emergency Alerts\n* Maintenance Records\n* Notifications"
        },
        {
          id: "4.3",
          title: "Use Case Diagram",
          content: "Actors:\n* Passenger, Driver, Admin, Transport Manager, Cloud Server\n\nUse Cases:\n* Track Bus, Manage Routes, Generate Alerts, Manage Tickets, Monitor Fuel, View Reports, Attendance Tracking"
        },
        {
          id: "4.4",
          title: "ER Diagram",
          content: "The ER Diagram defines relationships between:\n* Users and Tickets\n* Drivers and Buses\n* Routes and GPS Logs\n* Attendance and Passengers\n* Alerts and Notifications\n* Fuel Monitoring and Maintenance Records"
        },
        {
          id: "4.5",
          title: "User Interface Design",
          content: "Main Screens in the application:\n* Login Screen\n* Passenger Dashboard\n* Live Bus Tracking Screen\n* Ticket Booking Screen\n* Attendance Monitoring Screen\n* Emergency Alert Screen\n* Driver Dashboard\n* Admin Control Panel\n* Route Management Screen\n* Notification Center"
        }
      ]
    },
    {
      id: "ch5",
      number: "5",
      title: "Implementation and Testing",
      sections: [
        {
          id: "5.1",
          title: "Frontend Implementation",
          content: "The frontend of the Bus Smart System App can be developed using Flutter or React Native for cross-platform mobile application support.\n\nFeatures include:\n* Real-time map integration\n* Push notifications\n* Bus route display\n* Attendance dashboard\n* Ticket booking interface"
        },
        {
          id: "5.2",
          title: "Backend Implementation",
          content: "The backend system can be developed using Node.js or Python with cloud database integration.\n\nBackend services include:\n* GPS data processing\n* User authentication\n* Ticket management\n* Real-time notifications\n* Cloud analytics\n* Database management"
        },
        {
          id: "5.3",
          title: "Testing",
          content: "The following testing methods are used:\n* Unit Testing\n* Integration Testing\n* System Testing\n* GPS Accuracy Testing\n* Security Testing\n* Performance Testing\n* User Acceptance Testing"
        },
        {
          id: "5.4",
          title: "Challenges Faced",
          content: "* GPS signal interruptions\n* Internet connectivity issues\n* Sensor calibration problems\n* Real-time synchronization delays\n* Data security vulnerabilities\n* API integration challenges\n* Route optimization complexity"
        }
      ]
    },
    {
      id: "ch6",
      number: "6",
      title: "Conclusion and Future Enhancements",
      sections: [
        {
          id: "6.1",
          title: "Conclusion",
          content: "The Bus Smart System App provides an intelligent transportation management solution by integrating IoT technologies, GPS systems, cloud computing, and mobile applications.\n\nThe system improves passenger safety, transportation efficiency, route monitoring, and operational management while providing real-time information and smart automation features.\n\nThe application can be highly beneficial for schools, universities, offices, and public transportation systems."
        },
        {
          id: "6.2",
          title: "Future Enhancements",
          content: "Future improvements may include:\n* AI-Based Route Optimization\n* Facial Recognition Attendance\n* Voice Assistant Integration\n* Smart Traffic Management Integration\n* Predictive Maintenance System\n* Electric Bus Battery Analytics\n* Smart City Transportation Integration"
        }
      ]
    }
  ]
};
