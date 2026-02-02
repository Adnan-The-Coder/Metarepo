import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc, asc, and, like, or } from "drizzle-orm";
import { portfolio_consultation_scheduling } from "../db/schema";

export const scheduleConsultation = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    const body = await c.req.json();
    const {
      name,
      email,
      phone,
      company,
      role,
      about,
      goals,
      preferredDateTime,
      timezone,
      source,
      subscribed
    } = body;

    // ---- Basic validation ----
    if (
      !name ||
      !email ||
      !phone ||
      !company ||
      !role ||
      !about ||
      !goals ||
      !preferredDateTime
    ) {
      return c.json(
        {
          success: false,
          message: "Missing required fields"
        },
        400
      );
    }

    // ---- Email validation ----
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json(
        {
          success: false,
          message: "Please provide a valid email address"
        },
        400
      );
    }

    const normalizedEmail = email.toLowerCase();

    // ---- Check existing consultation by email ----
    const existing = await db
      .select()
      .from(portfolio_consultation_scheduling)
      .where(eq(portfolio_consultation_scheduling.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return c.json(
        {
          success: false,
          message:
            "A consultation request already exists for this email. We`ll reach out shortly."
        },
        409
      );
    }

    // ---- Insert new consultation ----
    const result = await db
      .insert(portfolio_consultation_scheduling)
      .values({
        name,
        email: normalizedEmail,
        phone,
        company,
        role,
        about,
        goals,
        preferredDateTime,
        timezone,
        source,
        subscribed: subscribed ?? true,
        status: "new",
        createdAt: new Date().toISOString()
      })
      .returning();

    return c.json({
      success: true,
      message: "Consultation request submitted successfully",
      data: {
        id: result[0].id,
        email: result[0].email,
        status: result[0].status,
        preferredDateTime: result[0].preferredDateTime,
        createdAt: result[0].createdAt
      }
    });
  } catch (error) {
    console.error("Consultation scheduling error:", error);

    // Handle race-condition unique constraint
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      return c.json(
        {
          success: false,
          message:
            "A consultation request already exists for this email."
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        message: "Internal server error. Please try again later."
      },
      500
    );
  }
};

export const getAllConsultations = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    // Extract query parameters
    const { 
      status, 
      search, 
      limit = "50", 
      offset = "0", 
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = c.req.query();

    // Build where conditions
    const conditions = [];
    
    if (status) {
      conditions.push(eq(portfolio_consultation_scheduling.status, status));
    }

    if (search) {
      conditions.push(
        or(
          like(portfolio_consultation_scheduling.name, `%${search}%`),
          like(portfolio_consultation_scheduling.email, `%${search}%`),
          like(portfolio_consultation_scheduling.company, `%${search}%`)
        )
      );
    }

    // Determine sort order
    const orderBy = sortOrder === "asc" 
      ? asc(portfolio_consultation_scheduling[sortBy as keyof typeof portfolio_consultation_scheduling])
      : desc(portfolio_consultation_scheduling[sortBy as keyof typeof portfolio_consultation_scheduling]);

    // Query with conditions
    const query = db
      .select()
      .from(portfolio_consultation_scheduling)
      .limit(Number.parseInt(limit))
      .offset(Number.parseInt(offset))
      .orderBy(orderBy);

    const consultations = conditions.length > 0
      ? await query.where(and(...conditions))
      : await query;

    // Get total count for pagination
    const countQuery = db
      .select()
      .from(portfolio_consultation_scheduling);
    
    const totalCount = conditions.length > 0
      ? (await countQuery.where(and(...conditions))).length
      : (await countQuery).length;

    return c.json({
      success: true,
      data: consultations,
      pagination: {
        total: totalCount,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        hasMore: Number.parseInt(offset) + consultations.length < totalCount
      }
    });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch consultations"
      },
      500
    );
  }
};

export const getConsultationById = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const id = c.req.param("id");

    if (!id) {
      return c.json(
        {
          success: false,
          message: "Consultation ID is required"
        },
        400
      );
    }

    const consultation = await db
      .select()
      .from(portfolio_consultation_scheduling)
      .where(eq(portfolio_consultation_scheduling.id, Number.parseInt(id)))
      .limit(1);

    if (consultation.length === 0) {
      return c.json(
        {
          success: false,
          message: "Consultation not found"
        },
        404
      );
    }

    return c.json({
      success: true,
      data: consultation[0]
    });
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch consultation"
      },
      500
    );
  }
};

export const updateConsultationStatus = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const id = c.req.param("id");
    const { status } = await c.req.json();

    if (!id || !status) {
      return c.json(
        {
          success: false,
          message: "ID and status are required"
        },
        400
      );
    }

    const validStatuses = ["new", "contacted", "scheduled", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return c.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        },
        400
      );
    }

    const result = await db
      .update(portfolio_consultation_scheduling)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(portfolio_consultation_scheduling.id, Number.parseInt(id)))
      .returning();

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          message: "Consultation not found"
        },
        404
      );
    }

    return c.json({
      success: true,
      message: "Status updated successfully",
      data: result[0]
    });
  } catch (error) {
    console.error("Error updating consultation status:", error);
    return c.json(
      {
        success: false,
        message: "Failed to update consultation status"
      },
      500
    );
  }
};
