import { pgTable,text,timestamp,uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Role enum
export const roleEnum = pgEnum("user_role", ["customer", "seller", "admin"]);

//"users" table
export const user = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    phoneNumber: text("phone_number"),
    role: roleEnum("role").default("customer").notNull(),
    createdAt: timestamp("created_at", { mode:"date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode:"date" })
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull()
})

export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    priceETB: integer("price_etb").notNull(),
    stock: integer("stock").default(0).notNull(),
    section: text("section").notNull(), // e.g., "Buna Tera", "Shiro Tera"
    teraId: text("tera_id").notNull(), // e.g., "buna", "shiro"
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    popular: text("popular").default("false"), // boolean as text for simplicity
    rating: text("rating"), // store as text, can be converted to number
    createdAt: timestamp("created_at", { mode:"date" }).defaultNow().notNull(),
   updatedAt: timestamp("updated_at", { mode:"date" })
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull()
})

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode:"date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode:"date" }).defaultNow().notNull(),
}) 

//User relations : user can have many products and many comments

export const userRelations = relations(user, ({ many }) => ({
    products: many(products), //one user to many products
    comments: many(comments) //one user to many comments
}))

//Produce relations : product can have many comments many() and belongs to one user one()

export const productRelations = relations(products, ({ one,many }) => ({
    comments: many(comments), //one product to many comments
    user: one(user, {
        fields: [products.userId], //foreign key in products table
        references: [user.id]      //references primary key in user table
    }) 
}))

//Comments relations : comment belongs to one user and one product

export const commentRelations =  relations(comments, ({ one }) => ({
   user: one(user, { 
    fields: [comments.userId],
    references: [user.id]}),
   product:one(products, { 
    fields: [comments.productId],
    references: [products.id]
   })
}))


//Type inteferneces for the tables
export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
