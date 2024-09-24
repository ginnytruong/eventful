**Main Components**

Login: allows users to authenticate and access their accounts
EventList: displays all available events, with options to sign up or view details 
EventCreation: allows users to create new events
EventDetails: displays information about specific event


**Data Flow**

User Authentication: when user logs in through login component, authenticate state will be checked via firebase
Successful authentication redirects them to the EventList component.


**Event Management:**

Event Creation : users use the EventCreation component to submit new events
Data is sent to firestore, which creates a new event document in the Events collection
Event Sign Up: users click on an EventList to sign up, this action creates a new document in the Registration collection.


![alt text](image.png)


**Firestore Data Model**

*Collections:*

Users:
userId (string)
email (string)
name (string)
eventsRegistered (array of eventIds)

Events:
eventId (string)
title (string)
description (string)
date (timestamp)
time (string)
price (number)
creatorId (string - ref to user who created the event)

Registrations: 
registrationId (string)
eventId (string - ref to Events)
userId (string - ref to Users)
registationDate (timestamp)

![alt text](image.png)

**User Flow**

Visitor: Can view the EventList and Login

Logged-in User:
Can sign up for events from EventList
Can see events they are registered for in a personal dashboard (to be implemented later)

Staff User: Can create new events through the EventCreation component

**wireframe**
![alt text](image.png)