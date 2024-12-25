# hello.rb

# ↓This type annotation is generated automatically by TypeProf
def say_hello(x)
  "Hello, " + x.name
end

# ↓This is a valid usage of the User class
alice = User.new("Alice")
msg = say_hello(alice)

# ↓No error because msg is correctly inferred to be a String
msg.upcase

# ↓This is an example of a type error detection;
# User#initialize does not accept an Integer as the first argument
bob = User.new(20)

# ↓This is another example of an error; User#age is not provided
charlie = User.new("Charlie", 20)
charlie.age # <- Error!
