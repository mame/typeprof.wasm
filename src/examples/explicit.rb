# type annotation example

# A user can specify the method type signature manually

#: (User) -> String
def say_hello(x)
  # Note that the method body is not implemented yet
  raise NotImplementedError
end

# ↓Error because the argument type is not a User
say_hello("Alice")

# The return type is inferred to be String as per the type signature
# even though the method body is not implemented yet
hello_bob = say_hello(User.new("Bob"))

# ↓Error because the return type is inferred to be String
hello_bob + 42 # <- Error!
