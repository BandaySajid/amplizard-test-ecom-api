# TEST API Documentation

## Base URL

```
http://localhost:7254
```

## Endpoints

### 1. Create a new Chat

- **POST** `/chat/:botId`
- **Description**: Initiates a chat with the specified bot.
- **Path Parameters**:
  - `botId`: The ID of the bot to chat with.
- **Request Body**:
  ```json
  {
    "saveHistory": true
  }
  ```
- **Response**:
  - **Status 201**: Success
    ```json
    {
      "status": "success",
      "chatId": "chat_id_value"
    }
    ```
  - **Status 500**: Error
    ```json
    {
      "status": "error",
      "error": "internal server error!"
    }
    ```

### 2. Get Current User

- **GET** `/user`
- **Description**: Retrieves the details of the current user (fixed user ID 1).
- **Response**:
  - **Status 200**: Success
    ```json
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com",
      "joined": "2022-01-15"
    }
    ```
  - **Status 404**: Error
    ```json
    {
      "status": "error",
      "description": "user does not exist!"
    }
    ```

### 3. Get Order by ID

- **POST** `/orders/:order_id`
- **Description**: Retrieves a specific order for a user.
- **Path Parameters**:
  - `order_id`: The ID of the order to retrieve.
- **Request Body**:
  ```json
  {
    "userId": <user_id>
  }
  ```
- **Response**:
  - **Status 200**: Success
    ```json
    {
      "id": 101,
      "userId": 1,
      "item": "Laptop",
      "amount": 1200,
      "imageUrl": "https://...",
      "date": "2024-08-16"
    }
    ```
  - **Status 400**: Error
    ```json
    {
      "status": "error",
      "description": "order not found for the user"
    }
    ```

### 4. Track Order

- **GET** `/orders/:order_id/track`
- **Description**: Retrieves tracking information for a specific order.
- **Path Parameters**:
  - `order_id`: The ID of the order to track.
- **Query Parameters**:
  - `userId`: The ID of the user.
- **Response**:
  - **Status 200**: Success
    ```json
    {
      "orderId": 101,
      "status": "In Transit",
      "estimatedDelivery": "2024-09-02",
      "lastLocation": "Warehouse 23, Springfield"
    }
    ```
  - **Status 404**: Error
    ```json
    {
      "status": "error",
      "description": "Order not found"
    }
    ```

### 5. Get All Orders for User

- **POST** `/orders`
- **Description**: Retrieves all orders for a specific user.
- **Request Body**:
  ```json
  {
    "userId": <user_id>
  }
  ```
- **Response**:
  - **Status 200**: Success
    ```json
    [
      {
        "id": 101,
        "userId": 1,
        "item": "Laptop",
        "amount": 1200,
        "imageUrl": "https://...",
        "date": "2024-08-16"
      },
      ...
    ]
    ```

### 6. Cancel Order

- **POST** `/orders/:order_id/cancel`
- **Description**: Cancels a specific order for a user.
- **Path Parameters**:
  - `order_id`: The ID of the order to cancel.
- **Request Body**:
  ```json
  {
    "userId": <user_id>
  }
  ```
- **Response**:
  - **Status 200**: Success
    ```json
    {
      "status": "success",
      "description": "Order with id {order_id} has been cancelled."
    }
    ```
  - **Status 404**: Error
    ```json
    {
      "status": "error",
      "description": "Order with id {order_id} does not exist!"
    }
    ```

## Notes

- Ensure that the server is running on the specified host and port (7254).
- For all endpoints, appropriate headers such as `Content-Type: application/json` may be necessary for requests with a body.
