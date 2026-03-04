<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Template;

use App\Traits\LogsActivity;

class TemplateController extends Controller
{
    use LogsActivity;
    public function index()
    {
        return $this->successResponse(Template::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'metadata' => 'nullable|array',
        ]);

        $template = Template::create($validated);
        $this->logActivity('Template Created', "Created template '{$template->name}'");
        return $this->successResponse($template, 'Template created successfully', 201);
    }

    public function show(Template $template)
    {
        return $this->successResponse($template);
    }

    public function update(Request $request, Template $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'metadata' => 'nullable|array',
        ]);

        $template->update($validated);
        $this->logActivity('Template Updated', "Updated template '{$template->name}'");
        return $this->successResponse($template, 'Template updated successfully');
    }

    public function destroy(Template $template)
    {
        $name = $template->name;
        $template->delete();
        $this->logActivity('Template Deleted', "Deleted template '{$name}'");
        return $this->successResponse(null, 'Template deleted successfully');
    }
}
