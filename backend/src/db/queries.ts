import { db } from "./index.js";
import { eq, and } from "drizzle-orm";
import { user,products,comments, type NewProduct, type NewUser, type NewComment} from "./schema.js";

//User queries
export const createUser = async (data: NewUser) => {
    const [userNew] = await db.insert(user).values(data).returning();
    return userNew;
}

export const getUserById = async (id: string) => {
    const foundUser = await db.query.user.findFirst({
        where: eq(user.id, id),
    });
    return foundUser || null;
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
    const [updatedUser] = await db.update(user).set(data).where(eq(user.id, id)).returning();
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
}

export const updateUserRole = async (id: string, role: "customer" | "seller" | "admin") => {
    const [updatedUser] = await db.update(user).set({ role }).where(eq(user.id, id)).returning();
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
}

export const upsertUser = async (data: NewUser) => {
    const [upsertedUser] = await db.insert(user).values(data).onConflictDoUpdate({
        target: user.id,
        set: data,
    }).returning();
    return upsertedUser;
}

export const getUsersByRole = async (role: "customer" | "seller" | "admin") => {
    return db.query.user.findMany({
        where: eq(user.role, role),
        orderBy: (user, { desc }) => [desc(user.createdAt)],
    });
}

export const getAllUsers = async () => {
    return db.query.user.findMany({
        orderBy: (user, { desc }) => [desc(user.createdAt)],
    });
}

export const deleteUser = async (id: string) => {
    const [deletedUser] = await db.delete(user).where(eq(user.id, id)).returning();
    if (!deletedUser) {
        throw new Error("User not found");
    }
    return deletedUser;
}

//Product queries

export const createProduct = async (data: NewProduct) =>{
    const [NewProduct] = await db.insert(products).values(data).returning();
    return NewProduct;
}

export const getAllProducts = async () => {
    return db.query.products.findMany({
        with: {user: true},
        orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
}

export const getAllProductsWithUsers = async () => {
    return db.query.products.findMany({
        with: {user: true},
        orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
}

export const getProductById = async (id: string) => {
    return db.query.products.findFirst({
        where: eq(products.id,id),
        with:{user: true, 
            comments:{ with : 
                {user: true},
                orderBy: (comments, { desc }) => [desc(comments.createdAt)]}
        }
    })
}

export const getProductsByUserId = async (userId: string) => {
       return db.query.products.findMany({
        where: eq(products.userId, userId),
        with: {user: true},
        orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
}

export const getProductsByTeraId = async (teraId: string) => {
    return db.query.products.findMany({
        where: eq(products.teraId, teraId),
        with: {user: true},
        orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
}

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    const [updateProduct] = await db.update(products).set(data).where(eq(products.id,id)).returning();
    return updateProduct;
}

export const deleteProduct = async (id: string) => {
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    const [deleteProduct] = await db.delete(products).where(eq(products.id,id)).returning();
    return deleteProduct;
}


//Comment queries

export const createComment = async (data: NewComment) => {
    const [NewComment] = await db.insert(comments).values(data).returning();
    return NewComment;
}

export const deleteComment = async (id: string) => {
    const existingComment = await getCommentsById(id);
    if (!existingComment) {
        throw new Error("Comment not found");
    }
    const [deleteComment] = await db.delete(comments).where(eq(comments.id,id)).returning();
    return deleteComment;
}

export const getCommentsById = async (id:string) => {
    return db.query.comments.findFirst({
        where: eq(comments.id,id),
        with: {user: true, product: true}
    })}
