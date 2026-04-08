import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionForm } from "./QuestionForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockSubmit = vi.fn().mockResolvedValue(undefined);

const defaultProps = {
  onSubmit: mockSubmit,
  isSubmitting: false,
};

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Sample Question Title" },
  });
  fireEvent.change(screen.getByLabelText("Question"), {
    target: { value: "What is the capital of France?" },
  });
}

// ---------------------------------------------------------------------------
// AnswerChoiceList behaviour
// ---------------------------------------------------------------------------

describe("QuestionForm — AnswerChoiceList behaviour", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with 2 default empty choice inputs", () => {
    render(<QuestionForm {...defaultProps} />);
    const choiceInputs = screen.getAllByRole("textbox", { name: /choice/i });
    expect(choiceInputs).toHaveLength(2);
  });

  it("disables the Add choice button when 6 choices already exist", () => {
    render(<QuestionForm {...defaultProps} />);
    const addBtn = screen.getByRole("button", { name: /add choice/i });

    fireEvent.click(addBtn);
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    expect(screen.getAllByRole("textbox", { name: /choice/i })).toHaveLength(6);
    expect(addBtn).toBeDisabled();
  });

  it("disables all Remove buttons when only 2 choices remain", () => {
    render(<QuestionForm {...defaultProps} />);
    const removeBtns = screen.getAllByRole("button", { name: /remove choice/i });
    expect(removeBtns).toHaveLength(2);
    removeBtns.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("enables Remove buttons when more than 2 choices exist", () => {
    render(<QuestionForm {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /add choice/i }));
    const removeBtns = screen.getAllByRole("button", { name: /remove choice/i });
    expect(removeBtns).toHaveLength(3);
    removeBtns.forEach((btn) => expect(btn).not.toBeDisabled());
  });

  it("removes a choice when its Remove button is clicked", () => {
    render(<QuestionForm {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /add choice/i }));
    expect(screen.getAllByRole("textbox", { name: /choice/i })).toHaveLength(3);

    fireEvent.click(screen.getAllByRole("button", { name: /remove choice/i })[0]);
    expect(screen.getAllByRole("textbox", { name: /choice/i })).toHaveLength(2);
  });

  it("deselects other choices when a choice is marked correct", () => {
    render(<QuestionForm {...defaultProps} />);
    const radios = screen.getAllByRole("radio");

    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();

    fireEvent.click(radios[1]);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });
});

// ---------------------------------------------------------------------------
// Form validation
// ---------------------------------------------------------------------------

describe("QuestionForm — form validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a validation error when no correct answer is marked on submit", async () => {
    render(<QuestionForm {...defaultProps} />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: /save question/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/mark one answer/i);
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("shows a validation error when fewer than 2 choices exist on submit", async () => {
    render(
      <QuestionForm
        {...defaultProps}
        initialValues={{
          title: "",
          description: "",
          body: "",
          answerChoices: [{ text: "Only choice", is_correct: true, sort_order: 0 }],
        }}
      />
    );
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: /save question/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/at least 2/i);
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    const user = userEvent.setup();
    render(<QuestionForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Title"), "Sample Question Title");
    await user.type(
      screen.getByLabelText("Question"),
      "What is the capital of France?"
    );
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(screen.getByRole("button", { name: /save question/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledOnce();
    });

    const callArg = mockSubmit.mock.calls[0][0];
    expect(callArg.title).toBe("Sample Question Title");
    expect(callArg.body).toBe("What is the capital of France?");
    expect(callArg.answerChoices[0].is_correct).toBe(true);
    expect(callArg.answerChoices[1].is_correct).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// API error display
// ---------------------------------------------------------------------------

describe("QuestionForm — API error display", () => {
  it("displays apiError prop when provided", () => {
    render(
      <QuestionForm {...defaultProps} apiError="This question could not be saved." />
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This question could not be saved."
    );
  });

  it("does not render an alert when apiError is null", () => {
    render(<QuestionForm {...defaultProps} apiError={null} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("disables the submit button while isSubmitting is true", () => {
    render(<QuestionForm {...defaultProps} isSubmitting={true} />);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("shows a custom submitLabel when provided", () => {
    render(<QuestionForm {...defaultProps} submitLabel="Create question" />);
    expect(
      screen.getByRole("button", { name: /create question/i })
    ).toBeInTheDocument();
  });

  it("renders a Cancel link pointing to cancelHref", () => {
    render(<QuestionForm {...defaultProps} cancelHref="/questions" />);
    const cancelLink = screen.getByRole("link", { name: /cancel/i });
    expect(cancelLink).toHaveAttribute("href", "/questions");
  });
});
