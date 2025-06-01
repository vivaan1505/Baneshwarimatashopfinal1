-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User addresses
create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  type text not null check (type in ('billing', 'shipping')),
  street_address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products table
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  brand text not null,
  description text,
  price decimal(10,2) not null check (price >= 0),
  discounted_price decimal(10,2) check (discounted_price >= 0),
  discount_percentage int check (discount_percentage >= 0 and discount_percentage <= 100),
  category text not null,
  subcategory text not null,
  image_url text not null,
  rating decimal(2,1) check (rating >= 0 and rating <= 5),
  review_count int default 0,
  stock_quantity int not null default 0,
  is_new boolean default false,
  is_bestseller boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product variants (sizes, colors)
create table public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  size text,
  color text,
  stock_quantity int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shopping cart
create table public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_variant_id uuid references public.product_variants(id) on delete cascade,
  quantity int not null check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_variant_id)
);

-- Orders
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  status text not null check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) not null,
  shipping_address_id uuid references public.addresses(id),
  billing_address_id uuid references public.addresses(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_variant_id uuid references public.product_variants(id) on delete set null,
  quantity int not null check (quantity > 0),
  price_at_time decimal(10,2) not null,
  created_at timestamptz default now()
);

-- Wishlists
create table public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  product_id uuid references public.products(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

create trigger update_addresses_updated_at
  before update on addresses
  for each row
  execute function update_updated_at_column();

create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

create trigger update_product_variants_updated_at
  before update on product_variants
  for each row
  execute function update_updated_at_column();

create trigger update_cart_items_updated_at
  before update on cart_items
  for each row
  execute function update_updated_at_column();

create trigger update_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();

create trigger update_reviews_updated_at
  before update on reviews
  for each row
  execute function update_updated_at_column();

-- Function to update product rating
create or replace function update_product_rating()
returns trigger as $$
begin
  update products
  set 
    rating = (
      select round(avg(rating)::numeric, 1)
      from reviews
      where product_id = new.product_id
    ),
    review_count = (
      select count(*)
      from reviews
      where product_id = new.product_id
    )
  where id = new.product_id;
  return new;
end;
$$ language plpgsql;

-- Trigger for updating product rating
create trigger update_product_rating_on_review
  after insert or update or delete on reviews
  for each row
  execute function update_product_rating();

-- Function to check stock before adding to cart
create or replace function check_stock_before_cart()
returns trigger as $$
begin
  if (
    select stock_quantity
    from product_variants
    where id = new.product_variant_id
  ) < new.quantity then
    raise exception 'Not enough stock available';
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger for checking stock
create trigger check_stock_before_cart_insert
  before insert or update on cart_items
  for each row
  execute function check_stock_before_cart();

-- RLS Policies
alter table public.users enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;

-- User policies
create policy "Users can view their own data"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on users for update
  using (auth.uid() = id);

-- Address policies
create policy "Users can view their own addresses"
  on addresses for select
  using (auth.uid() = user_id);

create policy "Users can create their own addresses"
  on addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own addresses"
  on addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own addresses"
  on addresses for delete
  using (auth.uid() = user_id);

-- Cart policies
create policy "Users can view their own cart"
  on cart_items for select
  using (auth.uid() = user_id);

create policy "Users can manage their own cart"
  on cart_items for all
  using (auth.uid() = user_id);

-- Order policies
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Wishlist policies
create policy "Users can view their own wishlist"
  on wishlists for select
  using (auth.uid() = user_id);

create policy "Users can manage their own wishlist"
  on wishlists for all
  using (auth.uid() = user_id);

-- Review policies
create policy "Anyone can view reviews"
  on reviews for select
  to public
  using (true);

create policy "Users can create reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on reviews for update
  using (auth.uid() = user_id);