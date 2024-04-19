describe("New Room Page Tests", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("#Email").type("admin@example.com");
    cy.get("#Password").type("admin@123");
    cy.get("button").contains("Login").click();

    cy.url().should("include", "/apppage");
    cy.contains("Resource and User Management").click();

    cy.url().should("include", "/resource-management");
    cy.contains("Rooms").click();
    cy.url().should("include", "/all-rooms");
    cy.contains("New Room").click();
    cy.url().should("include", "/new-room");
  });

  it("should display the New Room Form heading", () => {
    cy.contains("div", "New Room Form").should("be.visible");
  });

  it("should allow filling the form and submitting it", () => {
    cy.get("#roomNumber").type("227");
    cy.get("#roomType").type("VIP");
    cy.get(".select__input").click();
    cy.contains(".select__option", "Blood Pressure Monitor 2").click();
    cy.get("body").click(0, 0);
    cy.get("#availabilityStatus").should("be.visible").select("Available");

    cy.get("button").contains("Create Room").click();
    cy.visit("/all-rooms");
  });
});