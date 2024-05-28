# ARENA OF HONOR

Arena of Honor is a pixelart game in which you can create a character and face others ❗

![alt text](image.png)

## Use Cases

v1.0

- Create users
- Create character(select class[warrior or assassin] assigned to user)
- Delete character
- Buy arena_points to make purchases in the shop
- Buy skins in shop
- Update inventory when something is purchased(assigned to user)
- Retrieve Ranking (ranked by points)
- Select skin (in case you got one, if no skin is choosed will be replaced to default skin)
- Search match and battle against another user!
- 60s timer (in case time is 0 will be tie)
- Fight!

  -
  - W - Jump
  - A - moves left
  - D - moves right
  - Space - attack(hitbox enabled)
  - If someone dies, death sprite will be triggered & object deleted after animation finish
  - Update character victories if wins and 10 honor points
  - Control if someone try to avoid battle system (stand up character win)

- ELO SYSTEM!

  - If you win you will add 30 points to your character
  - If you lose 18 points will be removed from your character

  ❗ Can't have less than 0 elo points

  - DIVISIONS
    - Iron: 0 points
    - Bronze: 1 - 500 points
    - Silver: 501 - 799 points
    - Gold: 800 - 999 points
    - Platinum: 1000 - 1499 points
    - Emerald: 1500 - 1999 points
    - Diamond: 2000 - 2499 points
    - Master: 2500 - 2999 points
    - Grand Master: 3000 - 3499 points
    - Challenger: +3500 points

## FUTURE PATCH:

- Handle match making by divisions
- Each division will have different awards
- Play with Mage!

# Technical Description

## DATA MODEL

### Users

- name( string, required)
- surname( string, required)
- email( string, required)
- password( string, required)
- inventory(Array, required)

### Inventory

- name(string, required)
- quantity(number, required)
- itemId(associated to the item bought at the shop)

### Shop

- name(string, required)
- price(number, required)
- type(Array, required)
  - You can buy with arena_points or honor_points

### Characters

- name( string, required)
- class( string, required)
- win_streak( number, required)
- user_id( ObjectId, ref: 'User', required)

### Frontend

- JavaScript
- React
- Bootstrap
- Vite
- ESlint
- Socket.io.client

### Backend

- Typescript
- Mocha
- Chai
- Mongoose
- Node
- Sockets

### Security

- Jsonwebtoken
- Validation data
