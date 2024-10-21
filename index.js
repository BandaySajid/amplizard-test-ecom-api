import express from "express";

const server = express();
server.use(express.json());
server.use((req, _, next) => {
  console.log("URL called:", req.url);
  next();
});

const PORT = 7254;

const users = {
  1: {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    joined: "2022-01-15",
  },
  2: {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    joined: "2022-02-20",
  },
  3: {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    joined: "2022-03-05",
  },
};

const orders = {
  101: {
    id: 101,
    userId: 1,
    item: "Laptop",
    amount: 1200,
    imageUrl:
      "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2024-08-16",
  },
  102: {
    id: 102,
    userId: 2,
    item: "Smartphone",
    imageUrl:
      "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    amount: 800,
    date: "2024-08-15",
  },
  103: {
    id: 103,
    userId: 1,
    item: "Headphones",
    amount: 200,
    imageUrl:
      "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2024-08-17",
  },
  104: {
    id: 104,
    userId: 3,
    item: "Tablet",
    amount: 600,
    imageUrl:
      "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2024-08-14",
  },
};
function getUser(uid) {
  const user = users[uid];

  if (!user) return null;
  return user;
}

function getAllOrdersForUser(user_id) {
  const ordersForUser = Object.values(orders).filter(
    (o) => o.userId === Number(user_id),
  );

  return ordersForUser;
}

function getOrderForUser(order_id, user_id) {
  const order = orders[order_id];

  console.log("order", order);

  console.log("checking order for order id: and user id:", order_id, user_id);

  if (!order || order.userId !== Number(user_id)) {
    return null;
  }

  return order;
}

server.post("/chat/:botId", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const botId = botId;

    const resp = await fetch(
      `http://localhost:9090/api/v1/bots/${botId}/chat/new`,
      {
        body: JSON.stringify({ saveHistory: true }),
        method: "POST",
      },
    );

    const jsonResp = await resp.json();

    console.log(jsonResp);

    return res.status(201).json({
      status: "success",
      token: jsonResp.token,
      chatId: jsonResp.chatId,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "error", error: "internal server error!" });
  }
});

server.get("/user", function (req, res) {
  const user = getUser(1);
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", description: "user does not exist!" });
  }
  res.status(200).json(user);
});

server.post("/orders/:order_id", function (req, res) {
  console.log(req.body);
  const order = getOrderForUser(req.params.order_id, req.body.userId);
  if (!order) {
    return res
      .status(400)
      .json({ status: "error", description: "order not found for the user" });
  }
  res.status(200).json(order);
});

server.get("/orders/:order_id/track", function (req, res) {
  const order = getOrderForUser(req.params.order_id, req.query.userId);

  if (!order) {
    return res.status(404).json({
      status: "error",
      description: "Order not found",
    });
  }

  // Simulate tracking data
  const trackingInfo = {
    orderId: order.id,
    status: "In Transit",
    estimatedDelivery: "2024-09-02",
    lastLocation: "Warehouse 23, Springfield",
  };

  res.status(200).json(trackingInfo);
});

server.post("/orders", function (req, res) {
  console.log(req.body);
  const ordersForUser = getAllOrdersForUser(req.body.userId);
  res.status(200).json(ordersForUser);
});

server.post("/orders/:order_id/cancel", function (req, res) {
  const order = getOrderForUser(req.params.order_id, req.body.userId);

  if (order) {
    return res.status(200).json({
      status: "success",
      description: `Order with id ${req.params.order_id} has been cancelled.`,
    });
  }

  res.status(404).json({
    status: "error",
    description: `Order with id ${req.params.order_id} does not exist!`,
  });
});

server.listen(PORT, "0.0.0.0", function () {
  console.log("SERVER is listening on PORT:", PORT);
});
