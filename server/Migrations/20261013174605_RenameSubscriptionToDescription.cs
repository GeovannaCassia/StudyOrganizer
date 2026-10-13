using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaDeDisciplinas.Migrations
{
    /// <inheritdoc />
    public partial class RenameSubscriptionToDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Subscription",
                table: "Subject",
                newName: "Description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Subject",
                newName: "Subscription");
        }
    }
}
