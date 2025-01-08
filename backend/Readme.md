# API Endpoints

## 1. **`POST /user/register`**

### Request Body:
```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response:
- **Success**: 201 Created
  ```json
  {
    "token": "<JWT_TOKEN>",
    "user": {
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john.doe@example.com",
      ...
    }
  }
  ```

- **Error**: 400 Bad Request
  ```json
  {
    "errors": [
      {
        "msg": "Must be at least 3 characters",
        "param": "fullName.firstName",
        "location": "body"
      }
    ]
  }
  ```

---

## 2. **`POST /user/login`**

### Request Body:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response:
- **Success**: 200 OK
  ```json
  {
    "token": "<JWT_TOKEN>",
    "user": {
      "email": "john.doe@example.com",
      ...
    }
  }
  ```

- **Error**: 401 Unauthorized
  ```json
  {
    "message": "Invalid email or password"
  }
  ```



