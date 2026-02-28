import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc, asc, like, and, gte, lte } from "drizzle-orm";
import { osmania_university_results_storage } from "../db/schema";

// ---- CREATE: Insert a new result record ----
export const createResult = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    const body = await c.req.json();
    const { rollnumber, html_response, result_release_month_year } = body;

    // ---- Validate required fields ----
    if (!rollnumber || !html_response || !result_release_month_year) {
      return c.json(
        {
          success: false,
          message: "Missing required fields: rollnumber, html_response, result_release_month_year"
        },
        400
      );
    }

    // ---- Check for duplicate html_response (unique constraint) ----
    const existing = await db
      .select()
      .from(osmania_university_results_storage)
      .where(eq(osmania_university_results_storage.html_response, html_response))
      .limit(1);

    if (existing.length > 0) {
      return c.json(
        {
          success: false,
          message: "This result HTML response already exists in the database"
        },
        409
      );
    }

    // ---- Insert new result ----
    const result = await db
      .insert(osmania_university_results_storage)
      .values({
        rollnumber,
        html_response,
        result_release_month_year,
        createdAt: new Date().toISOString()
      })
      .returning();

    return c.json(
      {
        success: true,
        message: "Result record created successfully",
        data: result[0]
      },
      201
    );
  } catch (error) {
    console.error("Error creating result:", error);
    return c.json(
      {
        success: false,
        message: "Failed to create result record",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
};

// ---- READ: Get a single result by ID ----
export const getResultById = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param("id"));

    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          message: "Invalid ID provided"
        },
        400
      );
    }

    const result = await db
      .select()
      .from(osmania_university_results_storage)
      .where(eq(osmania_university_results_storage.id, id))
      .limit(1);

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          message: "Result record not found"
        },
        404
      );
    }

    return c.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error("Error fetching result:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch result record",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
};

// ---- READ: Get all results with pagination and filtering ----
export const getAllResults = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    // ---- Query parameters ----
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const rollnumber = c.req.query("rollnumber");
    const resultMonth = c.req.query("result_release_month_year");
    const sortBy = c.req.query("sortBy") || "createdAt";
    const order = (c.req.query("order") || "desc").toLowerCase();

    // ---- Validate pagination ----
    const pageNum = Math.max(1, isNaN(page) ? 1 : page);
    const pageSize = Math.max(1, Math.min(100, isNaN(limit) ? 10 : limit));
    const offset = (pageNum - 1) * pageSize;

    // ---- Build query with filters ----
    const filters: any[] = [];
    if (rollnumber) {
      filters.push(like(osmania_university_results_storage.rollnumber, `%${rollnumber}%`));
    }
    if (resultMonth) {
      filters.push(
        like(osmania_university_results_storage.result_release_month_year, `%${resultMonth}%`)
      );
    }

    let query = db.select().from(osmania_university_results_storage);
    if (filters.length > 0) {
      query = query.where(filters.length === 1 ? filters[0] : and(...filters));
    }

    // ---- Get total count ----
    const countResult = await db
      .select({ count: osmania_university_results_storage.id })
      .from(osmania_university_results_storage);

    const total = countResult.length;

    // ---- Apply sorting ----
    const sortColumn =
      sortBy === "rollnumber"
        ? osmania_university_results_storage.rollnumber
        : sortBy === "result_release_month_year"
          ? osmania_university_results_storage.result_release_month_year
          : osmania_university_results_storage.createdAt;

    const sortOrder = order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const results = await query
      .orderBy(sortOrder)
      .limit(pageSize)
      .offset(offset);

    return c.json({
      success: true,
      data: results,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: pageNum < Math.ceil(total / pageSize),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch results",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
};

// ---- UPDATE: Update a result record ----
export const updateResult = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param("id"));

    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          message: "Invalid ID provided"
        },
        400
      );
    }

    // ---- Check if record exists ----
    const existing = await db
      .select()
      .from(osmania_university_results_storage)
      .where(eq(osmania_university_results_storage.id, id))
      .limit(1);

    if (existing.length === 0) {
      return c.json(
        {
          success: false,
          message: "Result record not found"
        },
        404
      );
    }

    const body = await c.req.json();
    const { rollnumber, html_response, result_release_month_year } = body;

    // ---- At least one field must be provided ----
    if (!rollnumber && !html_response && !result_release_month_year) {
      return c.json(
        {
          success: false,
          message: "At least one field must be provided for update"
        },
        400
      );
    }

    // ---- Check for duplicate html_response if it's being updated ----
    if (html_response && html_response !== existing[0].html_response) {
      const duplicate = await db
        .select()
        .from(osmania_university_results_storage)
        .where(eq(osmania_university_results_storage.html_response, html_response))
        .limit(1);

      if (duplicate.length > 0) {
        return c.json(
          {
            success: false,
            message: "This HTML response already exists for another record"
          },
          409
        );
      }
    }

    // ---- Build update object ----
    const updateData: any = {};
    if (rollnumber) updateData.rollnumber = rollnumber;
    if (html_response) updateData.html_response = html_response;
    if (result_release_month_year) updateData.result_release_month_year = result_release_month_year;

    // ---- Perform update ----
    const updatedResult = await db
      .update(osmania_university_results_storage)
      .set(updateData)
      .where(eq(osmania_university_results_storage.id, id))
      .returning();

    return c.json({
      success: true,
      message: "Result record updated successfully",
      data: updatedResult[0]
    });
  } catch (error) {
    console.error("Error updating result:", error);
    return c.json(
      {
        success: false,
        message: "Failed to update result record",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
};

// ---- DELETE: Delete a result record ----
export const deleteResult = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param("id"));

    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          message: "Invalid ID provided"
        },
        400
      );
    }

    // ---- Check if record exists ----
    const existing = await db
      .select()
      .from(osmania_university_results_storage)
      .where(eq(osmania_university_results_storage.id, id))
      .limit(1);

    if (existing.length === 0) {
      return c.json(
        {
          success: false,
          message: "Result record not found"
        },
        404
      );
    }

    // ---- Delete record ----
    await db
      .delete(osmania_university_results_storage)
      .where(eq(osmania_university_results_storage.id, id));

    return c.json({
      success: true,
      message: "Result record deleted successfully",
      data: existing[0]
    });
  } catch (error) {
    console.error("Error deleting result:", error);
    return c.json(
      {
        success: false,
        message: "Failed to delete result record",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
};

// ---- GET: Get results by roll number ----
export const getResultByRollNumber = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const rollnumber = c.req.param("rollnumber");

    if (!rollnumber || rollnumber.trim() === "") {
      return c.json(
        {
          success: false,
          message: "Roll number is required"
        },
        400
      );
    }

    const results = await db
      .select()
      .from(osmania_university_results_storage)
      .where(eq(osmania_university_results_storage.rollnumber, rollnumber))
      .orderBy(desc(osmania_university_results_storage.createdAt));

    if (results.length === 0) {
      return c.json(
        {
          success: false,
          message: "No results found for this roll number"
        },
        404
      );
    }

    return c.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Error fetching results by roll number:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch results",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
};


export const getByRange = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    // ---- Get range parameter ----
    const rollRange = c.req.query("rollnumber");

    if (!rollRange || !rollRange.includes("-")) {
      return c.json(
        {
          success: false,
          message: "Please provide rollnumber range in format start-end"
        },
        400
      );
    }

    const [start, end] = rollRange.split("-");

    if (!start || !end) {
      return c.json(
        {
          success: false,
          message: "Invalid range format. Use start-end"
        },
        400
      );
    }

    // ---- Query with range filter ----
    const results = await db
      .select()
      .from(osmania_university_results_storage)
      .where(
        and(
          gte(osmania_university_results_storage.rollnumber, start),
          lte(osmania_university_results_storage.rollnumber, end)
        )
      )
      .orderBy(asc(osmania_university_results_storage.rollnumber));

    return c.json({
      success: true,
      total: results.length,
      data: results
    });

  } catch (error) {
    console.error("Error fetching range results:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch results by range",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
};